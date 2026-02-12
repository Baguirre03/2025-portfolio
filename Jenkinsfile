// CI only: build Docker image and smoke test. Deployment is on Vercel (git push → Vercel).
// Use this to validate the Dockerfile and that the app runs before/alongside Vercel deploys.

pipeline {
    agent any

    environment {
        IMAGE_NAME = "2025-portfolio"
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Build Docker Image") {
            steps {
                script {
                    def tag = "latest"
                    if (env.GIT_COMMIT) {
                        tag = env.GIT_COMMIT.take(7)
                    } else if (env.BITBUCKET_COMMIT) {
                        tag = env.BITBUCKET_COMMIT.take(7)
                    } else if (env.BRANCH_NAME) {
                        tag = env.BRANCH_NAME.replaceAll("[^a-zA-Z0-9]", "-")
                    }
                    env.DOCKER_IMAGE_TAG = "${IMAGE_NAME}:${tag}"
                }
                sh "docker build -t ${env.DOCKER_IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage("Smoke Test") {
            steps {
                sh """
                    docker run -d --name portfolio-smoke -p 3090:3000 ${env.DOCKER_IMAGE_TAG}
                    sleep 5
                    curl -sf --connect-timeout 10 http://localhost:3090/
                    docker stop portfolio-smoke
                    docker rm portfolio-smoke
                """
            }
        }
    }

    post {
        success {
            echo "Build succeeded. Image: ${env.DOCKER_IMAGE_TAG} (deploy is on Vercel)"
        }
        failure {
            echo "Build failed"
        }
        always {
            sh "docker rm -f portfolio-smoke 2>/dev/null || true"
        }
    }
}
