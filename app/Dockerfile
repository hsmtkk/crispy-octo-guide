FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY app.py /app/app.py
CMD chainlit run app.py --host 0.0.0.0 --port 80
EXPOSE 80
