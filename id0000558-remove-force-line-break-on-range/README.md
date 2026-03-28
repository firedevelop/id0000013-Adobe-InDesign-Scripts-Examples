### 🧹 Utility Script: Remove Forced Line Breaks (`id0000558`)

**Description:**
This ExtendScript surgically removes "Forced Line Breaks" (Shift+Enter) within a specific text range in Adobe InDesign. It replaces them with a standard space character to prevent words from merging. 

**Use Case:**
Translators often use forced line breaks for visual spacing in Word, which translates poorly into InDesign. It is highly recommended to run this utility script *before* executing the Diff Engine (Project `id0000557`) to neutralize messy formatting and ensure a clean text stream for comparison.

**How it Works:**
Instead of cleaning the entire document and risking unintended formatting changes, this script uses mathematical boundaries. It restricts the native Find/Change operation strictly between two text beacons.

**Step-by-Step Instructions:**
1. **Open Document:** Open your target `.indd` document in Adobe InDesign.
2. **Place Beacons:** * Type `[[START_SYNC]]` exactly where you want the cleanup to begin.
    * Type `[[END_SYNC]]` exactly where you want the cleanup to stop.
    * *Note: Both beacons must be located within the same threaded text flow.*
3. **Run Script:** Double-click `id0000558_Remove_Forced_Breaks.jsx` in your InDesign Scripts panel.
4. **Review:** A success alert will appear, telling you exactly how many forced line breaks were removed within your targeted range.

