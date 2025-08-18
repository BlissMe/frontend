provider "aws" {
  region = "us-east-1"  # Change if needed
}

resource "aws_key_pair" "blissme_key" {
  key_name   = "blissme_key"
  public_key = file("blissme_key.pub")  # Add your public key file here
}

resource "aws_instance" "frontend" {
  ami           = "ami-0c7217cdde317cfec"  # Ubuntu 22.04 (Mumbai)
  instance_type = "t2.micro"
  key_name      = aws_key_pair.blissme_key.key_name

  tags = {
    Name = "blissme-frontend"
  }

  vpc_security_group_ids = [aws_security_group.allow_http.id]

  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install -y docker.io",
      "sudo usermod -aG docker ubuntu"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("blissme_key")
      host        = self.public_ip
    }
  }
}

resource "aws_security_group" "allow_http" {
  name        = "allow_http"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
