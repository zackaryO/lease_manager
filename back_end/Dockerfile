# Use the official Python 3.11.5 image from the Docker Hub
FROM python:3.11.5

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY . .

# Specify the command to run on container start
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
