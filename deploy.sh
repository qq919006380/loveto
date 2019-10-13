# echo 生成静态文件
npm run build

echo 压缩部署包！
tar -zcvf dist.tar.gz dist server.js

echo 上传文件
scp -r dist.tar.gz root@47.92.80.58:/root/www

# 服务器环境开启

ssh root@47.92.80.58 -tt <<EOF

echo 进入目标目录
cd www

echo 删除dist server.js
rm -rf dist server.js

echo 解压dist.tar.gz 如果是解压二级目录可加参数 --strip-components 1
tar -zxvf dist.tar.gz 

echo 删除本地压缩包！
rm -rf dist.tar.gz

exit

EOF

# 服务器环境结束

echo 上传完成！

echo 删除本地压缩包！

rm -rf dist.tar.gz