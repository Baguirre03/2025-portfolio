pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage ('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage ('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            echo 'Buikd succeeded'
        }
        failure {
            echo 'Build failed'
        }
    }
}