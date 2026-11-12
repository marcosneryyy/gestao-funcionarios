# Servidor web leve para a aplicação estática
FROM nginx:1.27-alpine

# Remove a página padrão do nginx e copia a aplicação
RUN rm -rf /usr/share/nginx/html/*
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/  /usr/share/nginx/html/js/

EXPOSE 80
