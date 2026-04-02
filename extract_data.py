#!/usr/bin/env python3
"""
Data extraction script for PhoneSafe AU
Reads real enforcement data and generates JavaScript data files
"""

import pandas as pd
import json
import os
import sys

# Change to the data directory
os.chdir(r'C:\Users\Hoai\OneDrive\Documents\B-CS\2026_Spring\COS30045\phonesafe-au\Mobile_Phone_Offences_Project\Project')

try:
    # Read the Excel files
    print("Reading enforcement data...")
    df_merged = pd.read_excel('exports/mobile_phone_enforcement_merged.xlsx')
    df_age = pd.read_excel('exports/mobile_phone_enforcement_age_all_states.xlsx')
    
    print("\nMerged data shape:", df_merged.shape)
    print("Age data shape:", df_age.shape)
    print("\nMerged data columns:", df_merged.columns.tolist())
    print("\nAge data columns:", df_age.columns.tolist())
    
    print("\n" + "="*80)
    print("MERGED DATA - First 10 rows:")
    print("="*80)
    print(df_merged.head(10).to_string())
    
    print("\n" + "="*80)
    print("AGE DATA - First 10 rows:")
    print("="*80)
    print(df_age.head(10).to_string())
    
    # Extract key statistics
    print("\n" + "="*80)
    print("KEY STATISTICS:")
    print("="*80)
    
    if 'YEAR' in df_merged.columns:
        yearly = df_merged.groupby('YEAR').size().reset_index(name='count')
        print("\nYearly distribution:")
        print(yearly.to_string())
    
    if 'AGE_GROUP' in df_merged.columns:
        age_dist = df_merged.groupby('AGE_GROUP').size().reset_index(name='count')
        print("\nAge group distribution:")
        print(age_dist.to_string())
    
    if 'JURISDICTION' in df_merged.columns:
        juris_dist = df_merged.groupby('JURISDICTION').size().reset_index(name='count')
        print("\nJurisdiction distribution:")
        print(juris_dist.to_string())
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
