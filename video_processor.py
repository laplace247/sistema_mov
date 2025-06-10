# video_processor.py (versión con Diferencia de Frames)

import cv2
import numpy as np
import psycopg2
from flask import Flask, Response
from datetime import datetime
import threading
import time

# --- CONFIGURACIÓN Y PARÁMETROS ---
DB_CONFIG = {
    "dbname": "security_system",
    "user": "postgres",
    "password": "gatito",
    "host": "localhost",
    "port": "5432"
}
DEVICE_ID = 1

# ### PARÁMETROS DE LA NUEVA LÓGICA DE DETECCIÓN ###
MIN_CONTOUR_AREA = 500          # Área mínima de un contorno para ser considerado.
MOTION_THRESHOLD_AREA = 5000    # Suma de áreas de contornos para disparar un evento.
BLUR_SIZE = (21, 21)            # Tamaño del desenfoque para reducir ruido.
THRESHOLD_VAL = 25              # Umbral de diferencia de píxeles.
COOLDOWN_SECONDS = 10           # Tiempo de espera después de registrar un evento.

# --- INICIALIZACIÓN DE FLASK ---
app = Flask(__name__)

# --- FUNCIONES DE BASE DE DATOS (SIN CAMBIOS) ---
def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.OperationalError as e:
        print(f"Error al conectar con la base de datos: {e}")
        return None

def record_motion_event(device_id):
    conn = get_db_connection()
    if conn is None: return
    sql = """
        INSERT INTO public.events (device_id, event_type, motion_count, event_timestamp)
        VALUES (%s, %s, %s, %s) RETURNING event_id;
    """
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (device_id, 'motion_brusco', 1, datetime.now())) # Cambié el tipo de evento
            event_id = cur.fetchone()[0]
            conn.commit()
            print(f"MOVIMIENTO BRUSCO DETECTADO. Evento registrado con ID: {event_id}")
    except Exception as e:
        print(f"Error al insertar en la base de datos: {e}")
    finally:
        conn.close()

# --- LÓGICA DE PROCESAMIENTO DE VIDEO (TOTALMENTE REESTRUCTURADA) ---
def generate_frames():
    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        print("Error: No se pudo abrir la cámara web.")
        return

    # ### VARIABLES PARA LA NUEVA LÓGICA ###
    prev_frame_gray = None          # Almacenará el fotograma anterior en escala de grises.
    is_in_cooldown = False          # Bandera para saber si estamos en período de enfriamiento.
    cooldown_end_time = 0           # Momento en que termina el enfriamiento.

    print("Iniciando detección de movimiento (método de diferencia de frames)...")

    while True:
        success, frame = camera.read()
        if not success:
            print("Error al leer frame de la cámara.")
            break

        # 1. Preprocesamiento del frame actual
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, BLUR_SIZE, 0)

        # Si es el primer frame, solo lo guardamos y continuamos
        if prev_frame_gray is None:
            prev_frame_gray = gray
            # Transmitimos el primer frame sin procesar
            (flag, encodedImage) = cv2.imencode(".jpg", frame)
            if flag:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')
            continue

        # 2. Calcular diferencia con el frame anterior
        frame_delta = cv2.absdiff(prev_frame_gray, gray)
        
        # 3. Umbralizar y dilatar
        thresh = cv2.threshold(frame_delta, THRESHOLD_VAL, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)

        # 4. Encontrar contornos
        contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        total_motion_area = 0
        motion_detected_this_frame = False

        for contour in contours:
            contour_area = cv2.contourArea(contour)
            if contour_area < MIN_CONTOUR_AREA:
                continue

            motion_detected_this_frame = True
            total_motion_area += contour_area
            # Dibujar el contorno para visualización en el stream
            (x, y, w, h) = cv2.boundingRect(contour)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
        # ### Actualizamos el frame anterior para la siguiente iteración ###
        prev_frame_gray = gray

        # 5. Lógica de Detección y Registro
        current_time = time.time()
        
        # Primero, verificar si el cooldown ha terminado
        if is_in_cooldown and current_time > cooldown_end_time:
            is_in_cooldown = False

        # Si se detecta movimiento y el área supera el umbral Y NO estamos en cooldown
        if motion_detected_this_frame and total_motion_area > MOTION_THRESHOLD_AREA and not is_in_cooldown:
            # Lanzamos el registro en un hilo para no bloquear el stream
            threading.Thread(target=record_motion_event, args=(DEVICE_ID,)).start()
            # Activamos el cooldown
            is_in_cooldown = True
            cooldown_end_time = current_time + COOLDOWN_SECONDS

        # 6. Añadir información visual al stream
        status_text = "Detectando"
        color = (0, 255, 0) # Verde
        if is_in_cooldown:
            status_text = f"Cooldown ({int(cooldown_end_time - current_time)}s)"
            color = (0, 255, 255) # Amarillo
        if motion_detected_this_frame and total_motion_area > MOTION_THRESHOLD_AREA:
            status_text = "MOVIMIENTO BRUSCO"
            color = (0, 0, 255) # Rojo

        cv2.putText(frame, f"Estado: {status_text}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        cv2.putText(frame, f"Area Mov: {int(total_motion_area)}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)

        # 7. Codificar y transmitir el frame
        (flag, encodedImage) = cv2.imencode(".jpg", frame)
        if not flag:
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

    camera.release()
    print("Stream finalizado, cámara liberada.")

# --- RUTAS FLASK Y PUNTO DE ENTRADA (SIN CAMBIOS) ---
@app.route("/")
def index():
    return "Servidor de video en ejecución (método de diferencia de frames)."

@app.route("/video_feed")
def video_feed():
    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True, use_reloader=False)