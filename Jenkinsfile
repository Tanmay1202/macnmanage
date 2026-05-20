pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('dockerhub-creds')
    }

    stages {

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t tanmaybenot/macnmanage-frontend:v1 ./client'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t tanmaybenot/macnmanage-backend:v1 ./server'
            }
        }

        stage('Docker Login') {
            steps {
                sh 'echo $DOCKER_HUB_CREDS_PSW | docker login -u $DOCKER_HUB_CREDS_USR --password-stdin'
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh 'docker push tanmaybenot/macnmanage-frontend:v1'
            }
        }

        stage('Push Backend Image') {
            steps {
                sh 'docker push tanmaybenot/macnmanage-backend:v1'
            }
        }

    }
}