#! /bin/bash
if !(ls | grep 'node_modules');then
  npm install 
fi


echo -e "\033[32m npm run build please wait ... \033[0m"
npm run build 

product_path="$(ls dist)"
product_name=$(basename "$PWD")
time_str=$(date "+%Y%m%d%H%M")
package_name="${product_name}-${time_str}.zip"

if [ -n "${product_path}" ];then
  echo "zip in dist: ${product_path}"
  zip -r ${package_name} dist
else
  echo "build failed"
fi