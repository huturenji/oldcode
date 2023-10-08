#! /bin/bash
set -e

build_env=$1
build_version=$2

function npm_run()
{
  if !(ls | grep 'node_modules');then
    npm install 
  fi

  if [ $? -eq 0 ]; then
    if [ ! -n "${build_env}" ];then
      echo "build env is none,and defaut env is dev"
      npm run build -- ${build_version} ${build_env}
    else
      echo "build env is ${build_env}"
      npm run build${build_env}
    fi
  else
    return 1
  fi
}

echo "开始编译..."
start1=$(date +%s)
npm_run

end1=$(date +%s)
take1=$(( end1 - start1 ))
echo "Compile Success：${take1}s"

echo "微信小程序上传..."
start2=$(date +%s)
 
# upload
miniprogram-ci \
  upload \
  --pp ./dist/build/mp-weixin \
  --pkp ./private.wx1ffbe06fa79b65fb.key \
  --appid wx1ffbe06fa79b65fb \
  --uv ${build_version} \
  --threads 1 \
  -r 1 \
  --enable-es6 true \
  --enable-es7 true \
  --enable-autoprefixwxss true \
  --enable-minify true \
 
end2=$(date +%s)
take2=$(( end2 - start2 ))
 
echo "Upload Success: ${take2}s"
 
take3=$(( end2 - start1 ))
echo "Total Time: ${take3}s"