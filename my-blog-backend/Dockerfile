FROM python:3.12 as builder

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# 第二阶段：运行阶段
FROM python:3.12-slim

WORKDIR /code

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

# 复制项目代码
COPY ./ /code

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0"]