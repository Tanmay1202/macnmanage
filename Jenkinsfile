pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "tanmaybenot/macnmanage-frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "tanmaybenot/macnmanage-backend:${BUILD_NUMBER}"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Tanmay1202/macnmanage.git'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $FRONTEND_IMAGE ./client'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE ./server'
            }
        }

        stage('Push Frontend Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $FRONTEND_IMAGE'
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh 'docker push $BACKEND_IMAGE'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                sed -i 's|IMAGE_TAG|${BUILD_NUMBER}|g' k8s/frontend-deployment.yaml
                sed -i 's|IMAGE_TAG|${BUILD_NUMBER}|g' k8s/backend-deployment.yaml

                kubectl apply -f k8s/
                """
            }
        }
    }
}