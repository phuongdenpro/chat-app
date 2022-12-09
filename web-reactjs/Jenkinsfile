pipeline {
    agent any 
    
    tools {
        nodejs "node18.8"
    }
    
    environment {
        GIT_REPOSITORY = "git@github.com:tranvannhan1911/zalo-client.git"
        DOCKER_REPOSITORY = "tranvannhan1911/zalo-client"
        CONTAINER_NAME = "zalo-client"
        DOCKERHUB_CREDENTIAL = credentials('dockerhub')
        REACT_APP_BASE_URL = "http://34.87.181.95:8000/api"
    }
    
    stages {
        stage("Checkout"){
            steps {
                script{
                    checkout([$class: 'GitSCM', 
                        branches: [[name: "refs/heads/main"]],
                        extensions: [[$class: 'CleanCheckout']], // clean workspace after checkout
                        userRemoteConfigs: [[url: GIT_REPOSITORY, credentialsId: "git-zalo-client"]]])
                }
            }
        }
        
        // stage("Code analysis with SonarQube"){
        //     steps{
        //         script{
        //             def scannerHome = tool 'sonarqubescanner4.7';
        //             withSonarQubeEnv('sonarqube') {
                      
        //                 sh """${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=minimart-client -Dsonar.sources=."""
        //             }
                    
        //             timeout(time: 10, unit: 'MINUTES'){
        //                 waitForQualityGate abortPipeline: true
        //             }
        //         }
        //     }
        // }
        
        stage("Build"){
            steps {
                sh 'sed -i "/REACT_APP_BASE_URL=/c\\REACT_APP_BASE_URL=$REACT_APP_BASE_URL" .env'
                sh 'docker run --rm --log-driver=syslog -v \$(pwd):/app -w /app node:18.8.0-alpine3.16 /bin/ash -c "npm install --legacy-peer-deps && npm run build "'
            }
        }
        
        stage("Build docker image"){
            steps {
                script{
                    env.DOCKER_TAG = "v"+BUILD_NUMBER
                    env.DOCKER_REPOSITORY_TAG = DOCKER_REPOSITORY+":"+DOCKER_TAG
                    // appImage = docker.build DOCKER_REPOSITORY_TAG
                    sh 'docker build -t $DOCKER_REPOSITORY_TAG .'
                    
                }
                
            }
        }
        
        stage("Push image to docker hub"){
            steps {
                script{
                    // docker.withRegistry('', DOCKERHUB_CREDENTIAL){
                    //     appImage.push(DOCKER_TAG)
                    // }
                    sh 'echo $DOCKERHUB_CREDENTIAL_PSW | docker login -u $DOCKERHUB_CREDENTIAL_USR --password-stdin'
                    sh 'docker push $DOCKER_REPOSITORY_TAG'
                }
            }
            post{
                always{
			        sh "docker rmi $DOCKER_REPOSITORY_TAG"
                }
            }
        }
        
        // stage("Deploy"){
        //     agent{
        //         label "minimart-server"
        //     }
        //     steps {
        //         script{
        //             // sh 'echo $DOCKERHUB_CREDENTIAL_PSW | docker login -u $DOCKERHUB_CREDENTIAL_USR --password-stdin'
        //             sh 'docker stop $CONTAINER_NAME || true'
        //             sh 'docker rm $CONTAINER_NAME || true'
        //             sh "docker rmi -f \$(docker images -a | grep '${DOCKER_REPOSITORY}' | awk '{print \$3}') || true"
        //             sh '''docker run -d -p 3000:80 \
        //                 --restart on-failure:5 \
        //                 --name $CONTAINER_NAME \
        //                 $DOCKER_REPOSITORY_TAG'''
        //         }
                
        //     }
        // }
    }
    post {
		always {
            cleanWs()
            echo "cleaned"
            
            // emailext(
            //     attachLog: true, 
            //     subject: "Minimart Client - Build #$BUILD_NUMBER - ${currentBuild.result}", 
            //     body: 'Build url: $BUILD_URL', 
            //     to: 'tranvannhan1911@gmail.com')
		}
	}
}