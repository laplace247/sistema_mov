# video_processor.py (Versión final para SQLite3)

import cv2
import numpy as np
import sqlite3  # <--- Adaptado para SQLite
from flask import Flask, Response
from datetime import datetime
import threading
import time
import os

# --- CONFIGURACIÓN Y PARÁMETROS ---

# ¡IMPORTANTE! Ruta a la base de datos.
# Este script asume que está en una carpeta 'server' y la DB en 'database' a nivel de raíz.
# Ejemplo de estructura:
# /proyecto
#   /database
#     - security_system.db  <-- NUESTRA DB
#   /server
#     - video_processor.py  <-- ESTE ARCHIVO
# Si tu estructura es diferente, ajusta la ruta.
try:
    # Navega un nivel hacia arriba ('..') desde la carpeta actual del script,
    # y luego entra a 'database'
    DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'security_system.db')
    # Verificación de que la ruta es correcta y el archivo existe
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"No se encontró la base de datos en la ruta esperada: {os.path.abspath(DB_PATH)}")
except Exception as e:
    print(e)
    # Si no se puede construir la ruta, usa una ruta por defecto (menos robusta)
    DB_PATH = 'database/security_system.db'


DEVICE_ID = 1

# Parámetros de detección (sin cambios)
MIN_CONTOUR_AREA = 500
MOTION_THRESHOLD_AREA = 5000
BLUR_SIZE = (21, 21)
THRESHOLD_VAL = 25
COOLDOWN_SECONDS = 10

# --- INICIALIZACIÓN DE FLASK ---
app = Flask(__name__)

# --- FUNCIONES DE BASE DE DATOS (Adaptadas para SQLite3) ---
def get_db_connection():
    try:
        # check_same_thread=False es VITAL para que los hilos de Flask puedan usar la misma conexión.
        conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        return conn
    except sqlite3.Error as e:
        print(f"Error al conectar con la base de datos SQLite: {e}")
        return None

def record_motion_event(device_id):
    conn = get_db_connection()
    if conn is None: return

    # Sintaxis de SQLite: usa '?' para los parámetros. No hay cláusula RETURNING.
    sql = """
        INSERT INTO events (device_id, event_type, motion_count, event_timestamp)
        VALUES (?, ?, ?, ?)
    """
    try:
        cur = conn.cursor()
        # Pasamos los parámetros como una tupla. Usamos .isoformat() para la fecha.
        cur.execute(sql, (device_id, 'motion_brusco', 1, datetime.now().isoformat()))
        event_id = cur.lastrowid  # Así se obtiene el ID del último INSERT en SQLite
        conn.commit()
        print(f"MOVIMIENTO BRUSCO DETECTADO. Evento registrado con ID: {event_id}")
    except Exception as e:
        print(f"Error al insertar en la base de datos: {e}")
    finally:
        if conn:
            conn.close()

# --- LÓGICA DE PROCESAMIENTO DE VIDEO (Completa e integrada) ---
def generate_frames():
    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        print("Error: No se pudo abrir la cámara web.")
        return

    prev_frame_gray = None
    is_in_cooldown = False
    cooldown_end_time = 0

    print("Iniciando detección de movimiento con SQLite...")

    while True:
        success, frame = camera.read()
        if not success:
            print("Error al leer frame de la cámara.")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, BLUR_SIZE, 0)

        if prev_frame_gray is None:
            prev_frame_gray = gray
            (flag, encodedImage) = cv2.imencode(".jpg", frame)
            if flag:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')
            continue

        frame_delta = cv2.absdiff(prev_frame_gray, gray)
        thresh = cv2.threshold(frame_delta, THRESHOLD_VAL, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)
        contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        total_motion_area = 0
        motion_detected_this_frame = False

        for contour in contours:
            contour_area = cv2.contourArea(contour)
            if contour_area < MIN_CONTOUR_AREA:
                continue
            motion_detected_this_frame = True
            total_motion_area += contour_area
            (x, y, w, h) = cv2.boundingRect(contour)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
        prev_frame_gray = gray

        current_time = time.time()
        
        if is_in_cooldown and current_time > cooldown_end_time:
            is_in_cooldown = False

        if motion_detected_this_frame and total_motion_area > MOTION_THRESHOLD_AREA and not is_in_cooldown:
            # Lanzamos el registro en un hilo para no bloquear el stream
            threading.Thread(target=record_motion_event, args=(DEVICE_ID,)).start()
            is_in_cooldown = True
            cooldown_end_time = current_time + COOLDOWN_SECONDS

        status_text = "Detectando"
        color = (0, 255, 0)
        if is_in_cooldown:
            status_text = f"Cooldown ({int(cooldown_end_time - current_time)}s)"
            color = (0, 255, 255)
        if motion_detected_this_frame and total_motion_area > MOTION_THRESHOLD_AREA:
            status_text = "MOVIMIENTO BRUSCO"
            color = (0, 0, 255)

        cv2.putText(frame, f"Estado: {status_text}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        cv2.putText(frame, f"Area Mov: {int(total_motion_area)}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)

        (flag, encodedImage) = cv2.imencode(".jpg", frame)
        if not flag:
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

    camera.release()
    print("Stream finalizado, cámara liberada.")

# --- RUTAS FLASK Y PUNTO DE ENTRADA ---
@app.route("/")
def index():
    return "Servidor de video en ejecución (SQLite)."

@app.route("/video_feed")
def video_feed():
    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__ == '__main__':
    print(f"Intentando conectar a la base de datos en: {os.path.abspath(DB_PATH)}")
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True, use_reloader=False)