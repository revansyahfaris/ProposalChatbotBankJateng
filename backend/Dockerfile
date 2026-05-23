FROM node:20-slim

# Install dependencies untuk library native (ONNX/Chroma)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# Tambahkan flag build-from-source jika perlu untuk library native
RUN npm install

COPY . .

# Samakan dengan port yang kamu pakai di server.js
EXPOSE 5000

CMD ["node", "server.js"]