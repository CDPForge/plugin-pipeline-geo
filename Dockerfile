# Usa Node.js 20.11.1 come base
FROM node:20.11.1-alpine AS builder

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione prima di installare le dipendenze
COPY package.json package-lock.json tsconfig.json ./

# Installa tutte le dipendenze, incluse quelle di sviluppo
RUN npm install

# Copia il codice sorgente
COPY . .

# Compila TypeScript
RUN npm run build

# ---- Fase finale per l'immagine leggera ----
FROM node:20.11.1-alpine AS runner

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo i file necessari dalla fase di build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Crea la directory db e imposta i permessi appropriati
RUN mkdir -p /app/dist/db && chown -R node:node /app/dist

# Passa all'utente non-root
USER node

# Espone la porta su cui il server Express ascolta
EXPOSE 3000

# Comando per avviare l'applicazione
CMD ["node", "dist/index.js"]