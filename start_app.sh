#!/bin/bash

# Activation de l'environnement virtuel
if [[ "$OSTYPE" == "msys" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Unix-based
    source venv/bin/activate
fi

# Lancer l'application FastAPI
<<<<<<< HEAD
<<<<<<< HEAD
uvicorn app:app --host 0.0.0.0 --port 8000 &

# Lancer ngrok avec le sous-domaine statique configuré dans ngrok.yml
ngrok start default
=======
=======
>>>>>>> 861c9623ed87b89502c235425b4a0e61c0c01669
uvicorn app:app --reload

# Lancer ngrok avec le sous-domaine statique configuré dans ngrok.yml
ngrok start app
<<<<<<< HEAD
>>>>>>> 576f2bfd0e1de60e78ae621ec739daec0e08953c
=======
>>>>>>> 861c9623ed87b89502c235425b4a0e61c0c01669
