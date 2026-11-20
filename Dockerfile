FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html styles.css app.js robots.txt /usr/share/nginx/html/
COPY photos-b64 /tmp/b64
RUN mkdir -p /usr/share/nginx/html/photos && cat /tmp/b64/p*.txt | while read -r n data; do printf '%s' "$data" | base64 -d > "/usr/share/nginx/html/photos/$n"; done && rm -rf /tmp/b64 && ls -la /usr/share/nginx/html/photos
EXPOSE 8080
