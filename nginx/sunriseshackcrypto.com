upstream websocket {
   server localhost:3000;
}

server {
    listen 80;
	server_name sunriseshackcrypto.com www.sunriseshackcrypto.com;

    return 301 https://$host$request_uri;
}

server {
    # listen 80;
    listen 443 ssl;

    ssl_certificate /root/ssl/sunriseshackcrypto_com.crt;
    ssl_certificate_key /root/ssl/sunriseshackcrypto_com.key;

    server_name sunriseshackcrypto.com www.sunriseshackcrypto.com;

    root /var/www/sunrise/sunrise-wallet-frontend/dist;
    index index.html;

    gzip_disable "msie6";
    gzip_types text/plain application/xml application/x-javascript text/css application/json text/javascript;


    location / {
       try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass       http://127.0.0.1:3000;
        proxy_redirect   off;
    }

    location /.well-known/pki-validation/0682A2A83219BDFD15EC6A96DB971EA6.txt {
        alias /var/www/sunrise/.well-known/pki-validation/0682A2A83219BDFD15EC6A96DB971EA6.txt;
    }

    location /uploads/ {
        alias /var/www/sunrise/sunrise-wallet-backend/uploads/;

        location ~* \.(?:png|jpg|jpeg|gif|ico|svg|doc|docx|pdf)$ {
             expires max;
             log_not_found off;
        }
    }
}
