cmake_minimum_required (VERSION 3.1)
project(testJweLib)


MESSAGE(COLOR CYAN "===> source: ${PROJECT_SOURCE_DIR}")
	

IF (UNIX) 
	SET(CMAKE_C_COMPILER "gcc")
	SET(CMAKE_CXX_COMPILER "g++")
ELSE ()

ENDIF (UNIX)

set(DEPS_DEPS_PATH ${PROJECT_SOURCE_DIR}/../deps)
set(DEPS_BSL_INCLUDE_PATH ${PROJECT_SOURCE_DIR}/../../../../src)
set(DEPS_LINUX_SO_PATH ${PROJECT_SOURCE_DIR}/../../../../linux)
set(BSL_TEST_SRC_PATH ${PROJECT_SOURCE_DIR}/../src)

set(BSL_ROOT_PATH ${PROJECT_SOURCE_DIR}/../../../../)
set(SCL_INCLUDE_PATH ${BSL_ROOT_PATH}/include/scl/)


include_directories("${DEPS_DEPS_PATH}"
    "${DEPS_BSL_INCLUDE_PATH}"
	"${BSL_TEST_SRC_PATH}"
	"${SCL_INCLUDE_PATH}"
)
                    
file (GLOB TEST_CODE_SOURCES
    "${BSL_TEST_SRC_PATH}/*.cpp"
    "${BSL_TEST_SRC_PATH}/*.c"
    "${BSL_TEST_SRC_PATH}/*.h"
	"${DEPS_BSL_INCLUDE_PATH}/*.h"
	#"${DEPS_DEPS_PATH}/*.cpp"
	"${BSL_TEST_SRC_PATH}/Json/*.h"
	"${BSL_TEST_SRC_PATH}/Json/*.c")
source_group("" FILES ${TEST_CODE_SOURCES})

MESSAGE(COLOR CYAN "===> source: ${TEST_CODE_SOURCES}")

IF (WIN32)
link_directories("${DEPS_DEPS_PATH}"
"${BSL_ROOT_PATH}/libs/windows/libs"
"${BSL_ROOT_PATH}/windows/Release")
add_executable(testJweLib ${TEST_CODE_SOURCES})
target_link_libraries(testJweLib JweLib SinoCryptoLib zlib)

ELSEIF (UNIX)
link_directories(${DEPS_LINUX_SO_PATH})
add_executable(testJweLib ${TEST_CODE_SOURCES})
target_link_libraries(testJweLib JweLib SinoCryptoLib z)
ENDIF (WIN32)






