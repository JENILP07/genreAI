import os
import joblib
import pandas as pd
import numpy as np
import argparse
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from feature_extractor import extract_features
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

# Configuration
GENRES = ['blues', 'classical', 'country', 'disco', 'hiphop', 'jazz', 'metal', 'pop', 'reggae', 'rock']
RANDOM_SEED = 42

def prepare_dataset(data_path):
    """
    Iterates through the dataset directory and extracts features for all audio files.
    """
    print(f"Loading dataset from: {data_path}")
    features_list = []
    labels = []

    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset path not found: {data_path}")

    search_path = data_path
    if not any(os.path.isdir(os.path.join(data_path, g)) for g in GENRES if os.path.isdir(os.path.join(data_path, g))):
         potential_path = os.path.join(data_path, "genres")
         if os.path.exists(potential_path):
             search_path = potential_path

    print(f"Searching for genres in: {search_path}")

    for genre in GENRES:
        genre_path = os.path.join(search_path, genre)
        if not os.path.exists(genre_path):
            print(f"Warning: Genre folder not found: {genre_path}")
            continue

        print(f"Processing genre: {genre}")
        for filename in os.listdir(genre_path):
            if filename.endswith(".wav"):
                file_path = os.path.join(genre_path, filename)
                try:
                    features = extract_features(file_path, duration=3)
                    if features:
                        features_list.append(features)
                        labels.append(genre)
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

    if not features_list:
        raise ValueError("No features extracted. Check dataset path and structure.")

    df = pd.DataFrame(features_list)
    df['label'] = labels
    print(f"Feature extraction complete. Shape: {df.shape}")
    return df

def train_model(df):
    """
    Trains a Random Forest classifier with hyperparameter tuning.
    """
    print("\nStarting model training...")
    X = df.drop(columns=['label'])
    y = df['label']
    feature_columns = X.columns.tolist()
    
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=RANDOM_SEED, stratify=y_encoded
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    rf = RandomForestClassifier(random_state=RANDOM_SEED)
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [None, 10, 20],
        'min_samples_split': [2, 5]
    }
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)
    grid_search = GridSearchCV(
        rf, param_grid, cv=cv, scoring='accuracy', n_jobs=-1, verbose=1
    )
    grid_search.fit(X_train_scaled, y_train)
    
    best_model = grid_search.best_estimator_
    print(f"\nBest Parameters: {grid_search.best_params_}")
    
    y_pred = best_model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nTest Set Accuracy: {acc:.4f}")
    
    return best_model, scaler, le, feature_columns, acc

def save_artifacts(model, scaler, le, feature_columns, output_dir, version):
    """
    Saves artifacts with version suffix.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    suffix = f"_{version}" if version else ""
    print(f"\nSaving artifacts to {output_dir} with version '{version}'...")
    
    joblib.dump(model, os.path.join(output_dir, f"best_model{suffix}.pkl"))
    joblib.dump(scaler, os.path.join(output_dir, f"scaler{suffix}.pkl"))
    joblib.dump(le, os.path.join(output_dir, f"label_encoder{suffix}.pkl"))
    joblib.dump(feature_columns, os.path.join(output_dir, f"feature_columns{suffix}.pkl"))
    
    metadata = {
        "accuracy": float(model.score(scaler.transform(np.zeros((1, len(feature_columns)))), [0])) if False else "N/A", # Placeholder
        "model_type": "RandomForestClassifier",
        "version": version
    }
    joblib.dump(metadata, os.path.join(output_dir, f"results{suffix}.pkl"))
    
    print("All artifacts saved successfully.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Music Genre Classification Model")
    parser.add_argument("--dataset", type=str, required=True, help="Path to GTZAN dataset")
    parser.add_argument("--output", type=str, default="models", help="Output directory")
    parser.add_argument("--version", type=str, default="v1", help="Model version tag (e.g., v1, v2)")
    
    args = parser.parse_args()
    
    try:
        df = prepare_dataset(args.dataset)
        model, scaler, le, feature_columns, acc = train_model(df)
        save_artifacts(model, scaler, le, feature_columns, args.output, args.version)
    except Exception as e:
        print(f"\nTraining failed: {e}")