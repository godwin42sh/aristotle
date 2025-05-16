FROM nginx:alpine

# Copier les fichiers de l'application dans le répertoire de service nginx
COPY . /usr/share/nginx/html/

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour démarrer nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]