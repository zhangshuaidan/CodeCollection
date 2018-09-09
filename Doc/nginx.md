一、简介

Nginx("engine x")是一款是由俄罗斯的程序设计师 Igor Sysoev 所开发高性能的 Web 和 反向代理 服务器，也是一个 IMAP/POP3/SMTP 代理服务器。在高连接并发的情况下，Nginx 是 Apache 服务器不错的替代品。

二、准备

1、环境
系统平台：Red Hat Enterprise Linux Server release 7.3 (Maipo)

内核版本：3.10.0-514.el7.x86_64

2、安装编译工具和库文件
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel

3、安装pcre
PCRE 作用是让 Ngnix 支持 Rewrite 功能。

查看是否安装pcre

Bash
$ pcre-config --version

上述表明已安装。

若未安装，参照以下步骤：

1）下载

地址：https://sourceforge.net/projects/pcre/files/pcre/

2）解压安装包:
Bash
$ tar zxvf pcre-8.35.tar.gz

3）编译安装
Bash
$ cd pcre-8.35
$ ./configure
$ make && make install


三、安装

1、下载 nginx 安装包
http://nginx.org/download/

2、解压
Bash
$ tar zxvf nginx-1.9.9.tar.gz

3、编译
Bash
$ ./configure --prefix=/opt/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre

4、安装
Bash
$ make

Bash
$ make install

5、测试
查看nginx版本

Bash
$ /opt/nginx/sbin/nginx -v

显示版本信息，证明已安装成功

四、配置

1、创建用户(暂时废弃不用)
创建 Nginx 运行使用的用户 ruready：
Bash
$ /usr/sbin/groupadd ruready
$ /usr/sbin/useradd -g ruready ruready

2、配置nginx.conf
Bash
$ vim /opt/nginx/conf/nginx.conf

Bash
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    # 解决长轮询的问题
    proxy_buffering off;

    # 启用Gzip数据压缩
    gzip on;
    gzip_min_length  5k;
    gzip_buffers     4 16k;
    #gzip_http_version 1.0;
    gzip_comp_level 3;
    gzip_types       text/plain application/x-javascript text/css application/xml application/json text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    # 负载均衡配置
    upstream pss {
        ip_hash;
        server 192.168.21.128:8080;
    }

    upstream console {
       ip_hash;
       server 192.168.21.128:8022;
    }
    upstream rcs {
        ip_hash;
        server 192.168.21.128:8090;
    }

    server {
        listen       80;
        server_name  localhost;

        set $wwwroot /opt/nginx/html/;

        #charset koi8-r;
        add_header backendIP $upstream_addr;
        add_header backendCode $upstream_status;
        #access_log  logs/host.access.log  main;

        client_max_body_size 200m;
        client_body_buffer_size 256k;

        location / {
            root   "${wwwroot}pss-web/";
            index  index.html index.htm;
        }

        location /console-web {
            root   "${wwwroot}";
            index  index.html index.htm;
        }

        location /pss-web {
            root   "${wwwroot}/";
            index  index.html index.htm;
        }

        location /images/warehousemap.png{
            root "${wwwroot}console-web/";
            index index.html index.html;
        }

        # console-web有些取资源的时候直接访问的根目录所以处理一下
        location /images/warehousemap.json {
            root   "${wwwroot}console-web/";
            index  index.html index.htm;
        }

        location /images/logoavatar.png{
            root "${wwwroot}console-web/";
            index index.html index.html;
        }
        location /images/scale.png{
            root "${wwwroot}console-web/";
            index index.html index.html;
        }


        # /api/ -> 用于对接pss-operation服务接口
        location ^~ /api/ {
            proxy_pass http://pss/pss-operation/;
            # 转发真实客户端请求IP
            proxy_redirect off;
            proxy_set_header Host $host;#保留代理之前的host
            proxy_set_header X-Real-IP $remote_addr;#保留代理之前的真实客户端ip
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header    HTTP_X_FORWARDED_FOR $remote_addr;#在多级代理的情况下，记录每次代理之前的客户端真实ip
            # 共享Session
            proxy_cookie_path  /pss-operation /api;
        }

        # /console/ -> 用于对接pss-console/服务接口
        location ^~ /console/ {
            proxy_pass http://console/console/;
            # 转发真实客户端请求IP
            proxy_redirect off;
            proxy_set_header Host $host;#保留代理之前的host
            proxy_set_header X-Real-IP $remote_addr;#保留代理之前的真实客户端ip
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header    HTTP_X_FORWARDED_FOR $remote_addr;#在多级代理的情况下，记录每次代理之前的客户端真实ip
            # 共享Session
            proxy_cookie_path  /pss-console /console;
        }
        # /rcs/ -> 用于对接pss-rcs/服务接口
        location ^~ /rcs/ {
            proxy_pass http://rcs/pss-rcs/;
            # 转发真实客户端请求IP
            proxy_redirect off;
            proxy_set_header Host $host;#保留代理之前的host
            proxy_set_header X-Real-IP $remote_addr;#保留代理之前的真实客户端ip
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header    HTTP_X_FORWARDED_FOR $remote_addr;#在多级代理的情况下，记录每次代理                                                             客户端真实ip
            # 共享Session
            proxy_cookie_path  /pss-rcs /rcs;
        }
    }

    include servers/*;
}

3、检查配置文件ngnix.conf的正确性
Bash
$ /opt/nginx/sbin/nginx -t

五、启动
0、前端服务部署目录
Bash
$ /opt/nginx/html
1、启动命令
Bash
$ /opt/nginx/sbin/nginx

2、访问测试

3、可以通过 links命令测试
links 192.168.21.126

六、常用命令

/opt/nginx/sbin/nginx -c /usr/local/nginx/sbin/nginx/nginx.conf # 加载指定配置文件启动

/opt/nginx/sbin/nginx -s reload # 重新载入配置文件

/opt/nginx/sbin/nginx -s reopen # 重启 Nginx

/opt/nginx/sbin/nginx -s stop # 停止 Nginx

七、其他
1、设置开机启动
Bash
echo "/opt/nginx/sbin/nginx -c /opt/nginx/conf/nginx.conf" >> /etc/rc.local

2、添加到 service 服务
Bash
touch /etc/init.d/nginx
chmod 755 nginx   //修改脚本文件nginx的权限
chkconfig --add nginx  //将脚本文件加入chkconfig中
chkconfig --level 35 nginx on  //设置nginx开机在3和5级别自动启动


Nginx、Apache工作原理及Nginx为何比Apache高效  http://www.linuxidc.com/Linux/2017-03/141896.htm

CentOS 7下Nginx服务器的安装配置  http://www.linuxidc.com/Linux/2017-04/142986.htm

CentOS上安装Nginx服务器实现虚拟主机和域名重定向  http://www.linuxidc.com/Linux/2017-04/142642.htm

CentOS 6.8 安装LNMP环境（Linux+Nginx+MySQL+PHP）  http://www.linuxidc.com/Linux/2017-04/142880.htm

Nginx服务的SSL认证和htpasswd认证  http://www.linuxidc.com/Linux/2017-04/142478.htm

Linux中安装配置Nginx及参数详解  http://www.linuxidc.com/Linux/2017-05/143853.htm

Nginx日志过滤 使用ngx_log_if不记录特定日志 http://www.linuxidc.com/Linux/2014-07/104686.htm

CentOS 7.2下Nginx+PHP+MySQL+Memcache缓存服务器安装配置  http://www.linuxidc.com/Linux/2017-03/142168.htm

Tomcat 配置真实IP获取方式
XML
<!-- 使用Tomcat作为应用服务器，可以通过配置Tomcat的server.xml文件，在Host元素内最后加入：即可-->
<Valve className="org.apache.catalina.valves.RemoteIpValve" />
Nginx反向代理后应用程序如何获取客户端真实IP
https://blog.csdn.net/it_0101/article/details/78390700

如何让nginx显示文件夹目录
如何让nginx显示文件夹目录

vi /etc/nginx/conf.d/default.conf
Shell
location /build {
    root /var/jenkins_home/workspace/build  //指定实际目录绝对路径；
    autoindex on;                            //开启目录浏览功能；
    autoindex_exact_size off;            //关闭详细文件大小统计，让文件大小显示MB，GB单位，默认为b；
    autoindex_localtime on;              //开启以服务器本地时区显示文件修改日期！
}

