pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/Tanmay1202/macnmanage.git'
            }
        }


        stage('Build Frontend Image') {
            steps {
                sh 'docker build tanmaybenot/macnmanage-frontend:v1 ./client'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build tanmaybenot/macnmanage-backend:v1 ./server'
            }
        }

    }
}