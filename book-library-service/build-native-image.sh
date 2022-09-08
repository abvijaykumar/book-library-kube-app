export GRAALVM_HOME=$HOME/Downloads/graalvm-ce-java11-22.2.0/Contents/Home/
export JAVA_HOME=$GRAALVM_HOME
export PATH=$GRAALVM_HOME/bin:$PATH  
./mvnw package -Dnative -e

docker build -f Dockerfile.native -t bozo-book-library-service  .

docker push abvijaykumar/bozo-book-library-service:latest

