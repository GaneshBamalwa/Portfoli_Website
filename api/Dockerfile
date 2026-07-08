FROM python:3.11-slim

# Create a non-root user required by Hugging Face Spaces
RUN useradd -m -u 1000 user

# Switch to the non-root user
USER user

# Set home directory and path for the new user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set the working directory to the user's home
WORKDIR $HOME/app

# Copy requirements and install them as the non-root user
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app with correct permissions
COPY --chown=user . .

# Explicitly expose the port Hugging Face looks for
EXPOSE 7860

# Run the app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]