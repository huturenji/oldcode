cmake_minimum_required (VERSION 2.8)

project(SinoPaperprint)
MESSAGE("== ${CMAKE_BUILD_TYPE}")
 
IF (UNIX) 
	SET(CMAKE_C_COMPILER "gcc")
	SET(CMAKE_CXX_COMPILER "g++")
ENDIF (UNIX)

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -std=c99 -g")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

MESSAGE(COLOR CYAN "===> source: ${PROJECT_SOURCE_DIR}")
MESSAGE("bin dir: ${PROJECT_BINARY_DIR}") 


set(SOURCE_SRC_PATH ${PROJECT_SOURCE_DIR}/../src/)
set(SOURCE_LIBS_PATH ${PROJECT_SOURCE_DIR}/../libs/)
set(SOURCE_DEPS_PATH ${PROJECT_SOURCE_DIR}/../deps/)

set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON) 

MESSAGE("deps_path: ${SOURCE_DEPS_PATH}") 

include_directories("${SOURCE_SRC_PATH}"
				"${SOURCE_DEPS_PATH}/libraw/"
                "${SOURCE_DEPS_PATH}/opencv/"
                "${SOURCE_DEPS_PATH}/poco/Foundation/include"
				"${SOURCE_DEPS_PATH}/exiv2/include"
				)

#IF (WIN32) 
    set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/windows/)
    link_directories("${SOURCE_LIBS_PATH}/windows/lib/")
#ELSEIF (UNIX) 
#	set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/linux/)
#    link_directories(${SOURCE_LIBS_PATH}/linux/lib/)
#ENDIF (WIN32)

ADD_DEFINITIONS(-DNOMINMAX) # for exiv2

MESSAGE(STATUS "LIBRARY_OUTPUT_PATH: ${LIBRARY_OUTPUT_PATH}")

file (GLOB CODE_SOURCES
    "${SOURCE_SRC_PATH}/*.cpp"
    "${SOURCE_SRC_PATH}/*.h"
	"${SOURCE_SRC_PATH}/*.def"
    )
source_group("" FILES ${CODE_SOURCES})

add_library(SinoPaperprint SHARED ${CODE_SOURCES})

if(CMAKE_HOST_SYSTEM_NAME MATCHES "Windows")
    target_link_libraries(SinoPaperprint 
	libraw exiv2
	debug PocoFoundationd optimized PocoFoundation
	debug opencv_world470d optimized opencv_world470
	debug opencv_wechat_qrcode470d optimized opencv_wechat_qrcode470)
elseif(CMAKE_HOST_SYSTEM_NAME MATCHES "Linux")
    target_link_libraries(SinoPaperprint raw PocoFoundationd opencv_core opencv_imgcodecs opencv_imgproc opencv_highgui opencv_calib3d)
else()
	message("current platform: unkonw ") 
endif()







