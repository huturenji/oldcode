
#include <napi.h>
#include<string.h>
#include "Poco/Net/HTTPRequestHandler.h"
#include "Poco/Net/HTTPServer.h"
#include "Poco/Net/HTTPResponse.h"
#include "Poco/Net/HTTPServerRequest.h"
#include "Poco/Net/HTTPServerResponse.h"
#include "Poco/Net/ServerSocket.h"
#include "Poco/Util/ServerApplication.h"
#include <opencv2/opencv.hpp>
#include "Poco/Util/Timer.h"
#include "Poco/Util/TimerTaskAdapter.h"
#include "Poco/JSON/Object.h"
#include "Poco/JSON/Stringifier.h"


class VideoRequestHandler : public Poco::Net::HTTPRequestHandler {
public:
    void handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response) {
        // 设置响应头
       response.setContentType("multipart/x-mixed-replace; boundary=--videoBoundary");
    response.setChunkedTransferEncoding(true);

        cv::VideoCapture cap(0); // 打开默认摄像头
        if (!cap.isOpened()) {
            std::cerr << "无法打开摄像头." << std::endl;
            return;
        }
        
        std::ostream& ostr = response.send();

        while (true) {
            cv::Mat frame;
            cap >> frame;
            if (frame.empty()) {
                std::cerr << "无法捕获帧." << std::endl;
                break;
            }

            std::vector<uchar> jpegBuffer;
            cv::imencode(".jpg", frame, jpegBuffer);

            {
               
                ostr << "--videoBoundary\r\n";
                ostr << "Content-Type: image/jpeg\r\n";
                ostr << "Content-Length: " << jpegBuffer.size() << "\r\n\r\n";
                ostr.write(reinterpret_cast<const char*>(jpegBuffer.data()), jpegBuffer.size());
                ostr << "\r\n";
                ostr.flush();
            }


          // std::this_thread::sleep_for(std::chrono::seconds(10));

            Poco::Thread::sleep(150); // 限制帧率
        }

        cap.release();
    }
};


class DefaultRequestHandler : public Poco::Net::HTTPRequestHandler {
public:
    void handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response) {
        response.setContentType("text/html");
        std::ostream& ostr = response.send();
        ostr << "<html><body>server is start please enter right endpoint!</body></html>";
    }
};

class HelloRequestHandler : public Poco::Net::HTTPRequestHandler {
public:
    void handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response) {
        response.setContentType("text/html");
        std::ostream& ostr = response.send();
        ostr << "<html><body>Hello, this is test!</body></html>";
    }
};

class JSONRequestHandler : public Poco::Net::HTTPRequestHandler {
public:
    void handleRequest(Poco::Net::HTTPServerRequest& request, Poco::Net::HTTPServerResponse& response) {
        response.setContentType("application/json");
        Poco::JSON::Object jsonObj;
        jsonObj.set("message","JSON");
        jsonObj.set("value",32);
        //将JSON对象转换为字符串
        std::ostringstream jsonStr;
        Poco::JSON::Stringifier::stringify(jsonObj,jsonStr);
        std::ostream& ostr = response.send();
        ostr << jsonStr.str();
    }
};

class RequestHandlerFactory : public Poco::Net::HTTPRequestHandlerFactory {
public:
    Poco::Net::HTTPRequestHandler* createRequestHandler(const Poco::Net::HTTPServerRequest& request) {
        if(request.getURI()=="/video") {
            return new VideoRequestHandler; // 返回处理请求的请求处理程序
        }
        else if(request.getURI()=="/hello") {
            return new HelloRequestHandler;
        }
        else if (request.getURI() == "/JSON") {
            return new JSONRequestHandler;
        }else {
            return new DefaultRequestHandler;
        }
       
    } 
};



class MessageTimerTask : public Poco::Util::TimerTask {
public:
    void run() {
        // 在定时任务中发送消息
        std::cout << "Sending scheduled message..." << std::endl;
        // 在这里可以发送消息到客户端
    }
};

class MyServerApp : public Poco::Util::ServerApplication {
public:
    int runApplication() {
        // 在这里启动你的服务器
        // ...
        Poco::Net::ServerSocket svs(14725); // 创建服务器套接字，监听端口 8080
        std::cout << "server start...." << std::endl;

        Poco::Net::HTTPServer srv(new RequestHandlerFactory, svs, new Poco::Net::HTTPServerParams);

        srv.start();
        std::cout << "server started. port is 14725." << std::endl;
        waitForTerminationRequest();// 等待终止请求
        srv.stop();
        return Application::EXIT_OK;
    }
};
  
/**
 * 程序主入口，创建摄像头窗口，并且设置electron主窗口为父窗口
*/
Napi::Value CreateChildWindow(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    MyServerApp app;
    int result = app.runApplication();
	return Napi::Number::New(env,result);
}
/**
 * 导出函数
*/
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "createChildWindow"), Napi::Function::New(env, CreateChildWindow));//创建摄像头窗口 
    return exports;
}
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)