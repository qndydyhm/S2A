# S2A

## Team name
vme50

## Requirement
1. [nodejs](https://nodejs.org/en) 16+
2. [npm](https://www.npmjs.com/) 8+

## How to Run
1. [Backend](./backend)

2. [Frontend](./frontend)

3. Reverse proxy  
set up a reverse proxy, such as [nginx](https://nginx.org/en/)/[traefik](https://traefik.io/)  
here is a sample nginx config  

```
        upstream frontend {
                server 127.0.0.1:3000;
                keepalive 32;
        }
        upstream backend {
                server 127.0.0.1:4000;
                keepalive 32;
        }

        server {
            listen       80;
            server_name  localhost;

            location / {
                    proxy_pass http://frontend;

                    ## Headers
                    proxy_set_header Host $host;
                    proxy_set_header X-Original-URL $scheme://$http_host$request_uri;
                    proxy_set_header X-Forwarded-Proto $scheme;
                    proxy_set_header X-Forwarded-Host $http_host;
                    proxy_set_header X-Forwarded-Uri $request_uri;
                    proxy_set_header X-Forwarded-For $remote_addr;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header Connection "";

                    ## Basic Proxy Configuration
                    client_body_buffer_size 128k;
                    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503; ## Timeout if the real server is dead.
                    proxy_redirect  http://  $scheme://;
                    proxy_http_version 1.1;
                    proxy_cache_bypass $cookie_session;
                    proxy_no_cache $cookie_session;
                    proxy_buffers 64 256k;

                    ## Advanced Proxy Configuration
                    send_timeout 5m;
                    proxy_read_timeout 360;
                    proxy_send_timeout 360;
                    proxy_connect_timeout 360;
            }
            location ~* /((auth)|(api)) {
                    proxy_pass http://backend;

                    ## Headers
                    proxy_set_header Host $host;
                    proxy_set_header X-Original-URL $scheme://$http_host$request_uri;
                    proxy_set_header X-Forwarded-Proto $scheme;
                    proxy_set_header X-Forwarded-Host $http_host;
                    proxy_set_header X-Forwarded-Uri $request_uri;
                    proxy_set_header X-Forwarded-For $remote_addr;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header Connection "";

                    ## Basic Proxy Configuration
                    client_body_buffer_size 128k;
                    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503; ## Timeout if the real server is dead.
                    proxy_redirect  http://  $scheme://;
                    proxy_http_version 1.1;
                    proxy_cache_bypass $cookie_session;
                    proxy_no_cache $cookie_session;
                    proxy_buffers 64 256k;

                    ## Advanced Proxy Configuration
                    send_timeout 5m;
                    proxy_read_timeout 360;
                    proxy_send_timeout 360;
                    proxy_connect_timeout 360;
            }
        }
```