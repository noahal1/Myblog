FROM python:3.12

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY ./ /code

CMD ["uvicorn", "src.main:app","--host","0.0.0.0"]