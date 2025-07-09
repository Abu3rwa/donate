# Receipt Image Fraud Detection: Comprehensive Plan & Prompts

## Detection Strategy Plan

### 1. Image Forensics Analysis
- **EXIF metadata examination**
- **Compression artifact detection**
- **Pixel-level inconsistency analysis**
- **Color histogram analysis**
- **Edge detection anomalies**

### 2. Template Validation
- **Bank-specific template matching**
- **Logo authenticity verification**
- **Layout consistency checks**
- **Typography analysis**
- **Color scheme validation**

### 3. OCR & Data Validation
- **Text extraction and validation**
- **Account number format checking**
- **Transaction ID pattern matching**
- **Date/time consistency verification**
- **Amount format validation**

### 4. Behavioral Analysis
- **User submission patterns**
- **Device fingerprinting**
- **Geolocation consistency**
- **Timing pattern analysis**

### 5. Database Cross-referencing
- **Duplicate image detection**
- **Hash-based comparison**
- **Previous submission tracking**
- **Blacklist checking**

---

## Cursor Prompts

### Prompt 1: Core Detection Service
```md
Create a comprehensive fraud detection service for receipt images in React/Firebase. Include:
- Image hash generation for duplicate detection
- EXIF data extraction and analysis
- Compression artifact detection
- Template validation against known Bank of Khartoum formats
- OCR text extraction and validation
- Suspicious pattern detection (font inconsistencies, alignment issues)
- Color analysis for tampering detection
- Firebase integration for storing fraud reports
- Real-time analysis with progress indicators
- Detailed fraud score calculation with explanations
```

### Prompt 2: Advanced Image Analysis
```md
Build an advanced image forensics component that detects:
- Copy-move forgery detection using image correlation
- Splicing detection through compression level analysis
- Cloning detection via texture analysis
- Noise pattern inconsistencies
- Lighting and shadow inconsistencies
- Pixel-level manipulation detection
- Metadata tampering identification
- Digital signature verification
- Watermark detection and validation
- Error level analysis (ELA) implementation
```

### Prompt 3: OCR & Text Validation
```md
Create a comprehensive OCR and text validation system:
- Extract all text from receipt images
- Validate Bank of Khartoum specific formats
- Check transaction ID patterns (should start with 200...)
- Verify account number formats
- Validate amount formatting and currency
- Check date/time consistency
- Detect font inconsistencies indicating text replacement
- Validate text alignment and positioning
- Check for unnatural text artifacts
- Cross-reference extracted data with known patterns
```

### Prompt 4: Template Matching System
```md
Build a template matching system for Bank of Khartoum receipts:
- Store legitimate receipt templates
- Compare uploaded images against templates
- Detect logo manipulation or replacement
- Validate color scheme consistency
- Check layout positioning accuracy
- Verify UI element authenticity
- Detect missing or added elements
- Validate button and interface consistency
- Check for proper branding elements
- Score template matching accuracy
```

### Prompt 5: Behavioral Analytics
```md
Create a behavioral analysis system to detect fraudulent patterns:
- Track user submission frequency
- Monitor IP address patterns
- Detect device fingerprinting
- Analyze submission timing patterns
- Check for bulk submissions
- Monitor geolocation consistency
- Track browser and device information
- Detect automated submission patterns
- Flag suspicious user behavior
- Implement rate limiting and throttling
```

### Prompt 6: Firebase Integration
```md
Build Firebase integration for fraud detection:
- Store image hashes for duplicate detection
- Save fraud analysis results
- Track user submission history
- Implement real-time fraud alerts
- Create fraud report dashboard
- Store suspicious image samples
- Log all detection events
- Implement fraud pattern learning
- Create admin review interface
- Set up automated blocking rules
```

### Prompt 7: Machine Learning Detection
```md
Implement ML-based fraud detection:
- TensorFlow.js model for image classification
- Train on legitimate vs fake receipts
- Feature extraction from images
- Anomaly detection algorithms
- Pattern recognition for common fraud types
- Continuous learning from new samples
- Confidence scoring system
- Model versioning and updates
- Edge case handling
- Performance optimization
```

### Prompt 8: Real-time Validation API
```md
Create a real-time validation API integration:
- Mock Bank of Khartoum API calls
- Transaction verification endpoints
- Account validation services
- Real-time fraud scoring
- Batch validation processing
- API rate limiting and caching
- Error handling and fallbacks
- Response time optimization
- Security and authentication
- Logging and monitoring
```

### Prompt 9: User Interface Components
```md
Build comprehensive UI components for fraud detection:
- Image upload with preview
- Real-time analysis progress
- Detailed fraud score display
- Visual indicators for different fraud types
- Admin review interface
- Fraud report visualization
- User feedback collection
- Appeal process interface
- Detection history tracking
- Mobile-responsive design
```

### Prompt 10: Security & Performance
```md
Implement security and performance optimizations:
- Client-side image processing
- Secure file upload handling
- Data sanitization and validation
- Memory management for large images
- Caching strategies for templates
- Error handling and logging
- Performance monitoring
- Security headers and CSP
- Rate limiting implementation
- Audit trail creation
```

---

## Implementation Order

1. **Start with Prompt 1 for core detection service**
2. **Add Prompt 3 for OCR validation**
3. **Implement Prompt 4 for template matching**
4. **Build Prompt 6 for Firebase integration**
5. **Add Prompt 2 for advanced analysis**
6. **Implement Prompt 5 for behavioral analytics**
7. **Create Prompt 9 for UI components**
8. **Add Prompt 7 for ML detection**
9. **Implement Prompt 8 for API integration**
10. **Finish with Prompt 10 for security** 