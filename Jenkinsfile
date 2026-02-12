pipeline {
    agent any
    stages {
        stage('Test Docker') {
            steps {
                sh 'docker --version'
                sh 'docker ps'
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