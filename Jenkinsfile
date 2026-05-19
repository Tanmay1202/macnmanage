pipeline {
    agent any

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

    }
}