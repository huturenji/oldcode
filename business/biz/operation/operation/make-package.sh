#! /bin/bash

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
      if [ ${build_env} == "uat" ];then
        echo -e "\033[32m npm run buildSandbox please wait ... \033[0m"
        npm run buildSandbox -- ${build_version} ${build_env}
      elif [ ${build_env} == "prod" ];then
        echo -e "\033[32m npm run buildProd please wait ... \033[0m"
        npm run buildProd -- ${build_version} ${build_env}
      elif [ ${build_env} == "sit" ];then
        echo -e "\033[32m npm run buildBlack please wait ... \033[0m"
        npm run buildBlack -- ${build_version} ${build_env}
      else
        echo -e "\033[32m npm run build please wait ... \033[0m"
        npm run build -- ${build_version} ${build_env}
      fi 
    fi
    
  else
    return 1
  fi
}

function parse_args()
{
  product_path="$(ls dist)"
  product_name=$(basename "$PWD")
  time_str=$(date "+%Y%m%d%H%M")
  package_name="${product_name}-${time_str}.zip"

  tar_path="tar"
  tar_time_str=$(date "+%Y%m%d")
  tar_version=${build_version}
  tar_env=${build_env}
  if [ ! -n "${tar_version}" ];then
    tar_version="1.0.0"
  fi
  if [ ! -n "${tar_env}" ];then
    tar_env="uat"
  fi
  # tar_name="$(ls -1 -- tar/*.tar |sed 's#.*/##')"
  tar_name="${product_path}-${tar_version}-static-${tar_env}+${tar_time_str}.tar"
  echo "${tar_name}"
}


function compress_product()
{
  if [ -n "${product_path}" ];then
    echo "build in dist: ${product_path}"
    rm -rf ${product_path}/*
    cp -r dist/${product_path} .
    zip -r ${package_name} ${product_path}
    echo -e "application-name=${product_path}\npackage-name=${package_name}\npath=$(pwd)/${package_name}\ntar-path=${tar_path}\ntar-name=${tar_name}" > product-info.txt
    if [ ! -d devops_deploy ];then
      mkdir devops_deploy
    fi
    cp product-info.txt devops_deploy
    tar cvf devops_deploy.tar devops_deploy
    chmod -R 755 ${product_path}
    if [ ! -d ${tar_path} ];then
      mkdir ${tar_path}
    else
      rm -rf ${tar_path}/*
    fi
    
    if [ -n "${tar_name}" ];then
      echo -e ${tar_name} > tar-info.txt
      tar cvf ${tar_path}/${tar_name} ${product_path}
      printf $(md5sum ${tar_path}/${tar_name})>${tar_path}/${tar_name}.md5
    else
      echo "tar_name is null"
      return 1
    fi
  else
    echo "build failed"
    return 1
  fi
}

npm_run
if [ $? -eq 0 ]; then
  	parse_args
	if [ $? -eq 0 ]; then
	  compress_product
	else 
	    echo 'parse_args failed'
	     exit 1
	fi
else 
  echo 'npm_run failed'
  exit 1
fi