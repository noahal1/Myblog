FROM docker.xuanyuan.me/python:3.12 AS builder

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir -i https://mirrors.aliyun.com/pypi/simple/ -r requirements.txt

# 第二阶段：运行阶段
FROM docker.xuanyuan.me/python:3.12-slim

WORKDIR /code

# 复制 Python 依赖包
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

# 复制可执行文件（如 uvicorn）
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /code /code
COPY ./src /code/src
COPY ./.env /code/.env

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--log-level", "info"]