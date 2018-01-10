import pandas as pd
import pathlib

currentDirectory = pathlib.Path('./data')
currentPattern = "uber-raw-data-*"

merged = []
for currentFile in currentDirectory.glob(currentPattern): 
    df = pd.read_csv(currentFile, sep=",", header=0, usecols=[0, 1, 2])
    merged.append(df)

result = pd.concat(merged)
result.rename(columns={'Date/Time' : 'datetime'}, inplace=True)
result = result.sample(frac=0.0012)

result.to_csv('data/uber_all_data.csv')