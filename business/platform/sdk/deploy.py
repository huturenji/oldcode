#!/usr/bin/python2.7
# -*- coding: utf-8 -*-

import os
import sys
reload(sys)
sys.setdefaultencoding('utf-8')# python2解决编码问题 python3使用 import importlib importlib.reload(sys)
import traceback
import argparse
import re
import commands
from docxtpl import DocxTemplate
import time


"""
该脚本用于
打包部署静态代码
参数如下
-d          远程web服务器目录
-i          远程服务器ip地址
-p          安装包路径
--config    使用配置文件，并获取配置文件中的数值
命令范例如下
python deploy.py -i 10.0.5.201 -d /usr/local/SINO/jenkins/apache-tomcat-9.0.12/webapps/ROOT
"""


def _parse_cmd_args(args_list):
    """
    命令行参数
    :param args_list:
    :return: args
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--remote-dir", type=str, help="远程web服务器目录 ")
    parser.add_argument("--config", help='使用配置文件，并获取配置文件中的数值')
    parser.add_argument('-i', '--remote-ip', type=str, help="远程服务器ip地址")
    parser.add_argument("-p", "--package-path", type=str, help="安装包路径")

    parser.add_argument("-v","--version",type=str,help="发布包的版本号")
    parser.add_argument("-url","--svn-url",type=str,help="发布包svn地址")
    parser.add_argument("-svnname","--svn-name",type=str,help="svn用户名")
    parser.add_argument("-svnpwd","--svn-password",type=str,help="svn密码")
    parser.add_argument("-c","--apply-content",help="版本发布修改的内容")
    parser.add_argument("-u","--apply-user",type=str,help="申请人")

    parser.add_argument("-sname","--apply-service-name",type=str,help="申请服务名称")
    parser.add_argument("-pname","--apply-product-name",type=str,help="申请产品名称")
    parser.add_argument("-gurl","--git-url",type=str,help="源码git地址")
    parser.add_argument("-dpt","--apply-dpt",type=str,help="申请人部门")
    

    args = parser.parse_args(args_list)
    if args.remote_dir is None or args.remote_ip is None :
        parser.print_help()
        raise Exception('Miss arguments')
    return args


def _get_info(info_file, match_key, separator=':'):
    """
    获取文件内容信息
    :param info_file:
    :return: dictionary {'version','git_sha'}
    """
    res_dict = {}
    with open(info_file, 'r') as f:
        for line in f.readlines():
            line = line.strip('\n')
            for key in match_key.split(','):
                if re.match(key, line, re.I):
                    match_value = line.split(separator)[1]
                    res_dict[key] = match_value
    return res_dict


def _uncompress_tar(package_path, des_path=None):
  """
  解压标准包
  :param package_path: 压缩包完整路径
  :return: current_dir, package_name, uncompress_dir
  """
  if des_path is None:
    current_dir = os.path.split(package_path)[0]
  else:
    current_dir = des_path
  package_name = os.path.split(package_path)[1]
  uncompress_dir = '.'.join(package_name.split('.')[:-1])
  uncompress_cmd = 'tar xf %s -C %s' % (package_path, current_dir)
  result, output = commands.getstatusoutput(uncompress_cmd)
  if result is not 0:
    raise Exception(output)
  return current_dir, package_name, uncompress_dir


def _do_deploy(args_list):
    '''
    部署静态包
    :param args_list:命令行参数
    修改zip包权限
    :return:
    '''
    args = _parse_cmd_args(args_list)
    build_dir = os.getcwd()
    devops_deploy_tar_file = os.path.join(build_dir, 'devops_deploy.tar')
    current_dir, package_name, uncompress_dir = _uncompress_tar(devops_deploy_tar_file)
    print('产品信息读取中...')
    prodcut_info_file = os.path.join(os.path.join(current_dir, uncompress_dir), 'product-info.txt')
    if args.package_path is None:
      args.package_path = _get_info(prodcut_info_file, 'path', '=')['path']
    application_name = str(_get_info(prodcut_info_file, 'application-name', '=')['application-name'])
    if args.git_url is not None:
      args.git_url = args.git_url.split(':')[1]

    #发布包路径
    args.tar_path = str(_get_info(prodcut_info_file, 'tar-path', '=')['tar-path'])
    #发布包名称
    args.tar_name = str(_get_info(prodcut_info_file, 'tar-name', '=')['tar-name'])
    # application_dir = os.path.join(args.remote_dir,application_name)
    print('修改部署包权限...')
    chmod_cmd = 'chmod -R 755 %s' % args.tar_path
    status, output = commands.getstatusoutput(chmod_cmd)
    if status != 0:
      raise Exception('修改部署包文件权限失败%s' % args.tar_path)
    print('修改安装包权限...')
    chmod_cmd = 'chmod 755 %s' % args.package_path
    status, output = commands.getstatusoutput(chmod_cmd)
    if status != 0:
      raise Exception('修改文件权限失败%s' % devops_deploy_tar_file)
    print('部署中...')
    scp_cmd = "scp -rp %s root@%s:%s" %(args.package_path, args.remote_ip, args.remote_dir)
    status,output = commands.getstatusoutput(scp_cmd)
    if status != 0:
        raise Exception('copy %s failed' % args.package_path)
    package_name = os.path.split(args.package_path)[1]
    # 添加打印信息...
    # print('获取%s成功'%package_name)
    # 先删除之前部署的文件夹
    remote_delete_cmd = 'ssh %s "cd %s && rm -rf %s"' % (args.remote_ip, args.remote_dir, application_name)
    commands.getstatusoutput(remote_delete_cmd)
    remote_cmd = 'ssh %s "cd %s && unzip -o %s && rm -f %s "' % (args.remote_ip, args.remote_dir, package_name,package_name)
    commands.getstatusoutput(remote_cmd)
    print('执行修改文件权限')
    chmod_cmd = 'ssh %s "cd %s && chmod -R 755 %s/ "' % (args.remote_ip,args.remote_dir,application_name)
    # print('cmd:',chmod_cmd)
    status,output = commands.getstatusoutput(chmod_cmd)
    if status != 0:
      raise Exception('deploy %s failed' % package_name)
    else:
      print('部署成功')
      if args.svn_url and args.svn_name and args.svn_password:
        #获取svn上一个版本的包地址
        svn_list_cmd = "svn list %s --username %s --password %s --no-auth-cache |sort -n -t '.' -k1,1 -k2,2 -k3,3|grep '.tar$'|tail -1" %(args.svn_url,args.svn_name,args.svn_password)
        status,output = commands.getstatusoutput(svn_list_cmd)
        args.rollback_tar_name = output
        print('rollback_tar_name is: %s' %args.rollback_tar_name)
        if status != 0:
          raise Exception('rollback_tar_name failed')
        rollback_tar_version_cmd = "echo %s |awk -F '-' '{print $2}'" %(args.rollback_tar_name)
        status, output = commands.getstatusoutput(rollback_tar_version_cmd)
        args.rollback_tar_version = output
        if status != 0:
          raise Exception('rollback_tar_version failed')
        #生成word,需要从product_info_file中获取tar_name
        render_doc = _do_doc(args)
        if render_doc != True:
            raise Exception('_do_doc failed')
        else:
            svn_import_cmd = "svn import %s/tar %s --username %s --password %s -m 'import new project' --no-auth-cache" %(build_dir,args.svn_url,args.svn_name,args.svn_password)
            status,output = commands.getstatusoutput(svn_import_cmd)
            if status != 0:
              raise Exception('svn_import failed')
            else:
              print('svn 导入tar包成功，打包结束')
              sys.exit(0)
      else:
        sys.exit(0)

def _do_doc(args):
    doc = DocxTemplate('./archived_template.docx')
    content = {
        'apply_dpt':args.apply_dpt,#申请部门 需要传递
        'apply_user':args.apply_user,#申请人
        'apply_service_name':args.apply_service_name,#静态资源包服务名称，例如shop、train、flight等
        'apply_product_name':args.apply_product_name,#静态资源包产品名称，例如 B+商城、B+资讯、B+商旅等
        'tar_name':args.tar_name,#静态资源包名称
        'apply_date':time.strftime("%Y年%m月%d日",time.localtime(time.time())),#申请时间
        'git_url':args.git_url,#服务源码git地址
        'git_version':args.version,#git版本号
        'tar_version':args.version,#静态资源包版本号
        'apply_content':args.apply_content,#静态资源包发布修改内容
        'svn_url':str(args.svn_url)+str(args.tar_name),#静态资源包发布地址
        'rollback_tar_version':args.rollback_tar_version,#回退版本版本号
        'rollback_tar_name':args.rollback_tar_name,#回退版本包名
        'rollback_svn_url':str(args.svn_url)+str(args.rollback_tar_name)#回退版本路径
    }

    doc.render(content)
    doc.save('./bplus.docx'.decode('utf-8').encode('gbk'))
    print('生成word文档成功')
    return True

def do_deploy(args):
    """
    对外暴露的接口，可供外部 python 程序调用
    :param args: list，和执行脚本时的命令行参数相同
    :return:  Boolean，是否成功的标志
    """
    try:
        return _do_deploy(args)
    except Exception:
        traceback.print_exc()
        print "render FAIL"
        sys.exit(1)


def do_test():
    args = []

def main(args):
    origin_work_dir = os.getcwd()
    try:
        os.chdir(sys.path[0])
        _do_deploy(args)
    finally:
        os.chdir(origin_work_dir)  # 将工作路径还原回去


if __name__ == '__main__':
    main(sys.argv[1:])
