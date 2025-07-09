import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, XCircle, AlertCircle, Camera, FileText, Loader2 } from 'lucide-react';

const DonatePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  // Expected validation criteria based on your receipt format
  const validationCriteria = {
    requiredFields: [
      'transactionId',
      'dateTime',
      'fromAccount',
      'toAccount',
      'amount',
      'bankName'
    ],
    bankName: 'Bank of Khartoum',
    expectedToAccount: '0813 0156 8752 0001', // Based on your sample
    minimumAmount: 1.00,
    maximumAmount: 1000000.00
  };

  // Mock AI validation function (replace with actual AI service)
  const validateReceiptWithAI = async (imageFile) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted data (in real implementation, this would come from AI service)
    const mockExtractedData = {
      transactionId: '20029165731',
      dateTime: '01-May-2025 11:40:03',
      fromAccount: '0063 0280 9655 0001',
      toAccount: '0813 0156 8752 0001',
      toAccountTitle: 'Mohamed Abdelhameed Ibrahim Mohamed',
      amount: 100000.00,
      bankName: 'Bank of Khartoum',
      currency: 'SDG'
    };

    return mockExtractedData;
  };

  const validateExtractedData = (data) => {
    const errors = [];
    const warnings = [];

    // Check required fields
    validationCriteria.requiredFields.forEach(field => {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate bank name
    if (data.bankName && !data.bankName.includes(validationCriteria.bankName)) {
      errors.push(`Receipt must be from ${validationCriteria.bankName}`);
    }

    // Validate destination account
    if (data.toAccount && data.toAccount !== validationCriteria.expectedToAccount) {
      errors.push(`Funds must be transferred to the correct donation account`);
    }

    // Validate amount
    if (data.amount) {
      if (data.amount < validationCriteria.minimumAmount) {
        errors.push(`Amount must be at least ${validationCriteria.minimumAmount}`);
      }
      if (data.amount > validationCriteria.maximumAmount) {
        warnings.push(`Large donation amount detected: ${data.amount}`);
      }
    }

    // Validate date (should be recent)
    if (data.dateTime) {
      const receiptDate = new Date(data.dateTime);
      const now = new Date();
      const daysDiff = (now - receiptDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 30) {
        warnings.push('Receipt is older than 30 days');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      setValidationResult(null);
      setExtractedData(null);
    }
  };

  const handleValidation = async () => {
    if (!selectedFile) return;

    setIsValidating(true);
    setValidationResult(null);

    try {
      // Extract data using AI
      const extractedData = await validateReceiptWithAI(selectedFile);
      setExtractedData(extractedData);

      // Validate extracted data
      const validation = validateExtractedData(extractedData);
      setValidationResult(validation);

      // If valid, you can proceed to add to Firebase
      if (validation.isValid) {
        await addDonationToFirebase(extractedData);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: ['Failed to process receipt. Please try again.'],
        warnings: []
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Mock Firebase function (replace with actual Firebase integration)
  const addDonationToFirebase = async (donationData) => {
    // Simulate Firebase add operation
    console.log('Adding donation to Firebase:', donationData);
    
    // In real implementation:
    // const donationDoc = {
    //   ...donationData,
    //   status: 'verified',
    //   createdAt: new Date(),
    //   verifiedBy: 'AI_SYSTEM'
    // };
    // await db.collection('donations').add(donationDoc);
  };

  const ValidationStatus = ({ result }) => {
    if (result.isValid) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">Receipt Validated Successfully</span>
          </div>
          <p className="text-green-700 mt-2">Donation has been recorded and verified.</p>
          {result.warnings.length > 0 && (
            <div className="mt-3">
              <p className="text-orange-600 text-sm font-medium">Warnings:</p>
              <ul className="text-orange-600 text-sm mt-1">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="text-red-600" size={20} />
            <span className="text-red-800 font-medium">Validation Failed</span>
          </div>
          <ul className="text-red-700 mt-2">
            {result.errors.map((error, index) => (
              <li key={index} className="flex items-center space-x-1">
                <span>•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Donation Receipt Validator</h2>
        <p className="text-gray-600">Upload your Bank of Khartoum transfer receipt for verification</p>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="space-y-4">
              <img 
                src={previewUrl} 
                alt="Receipt preview" 
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto text-gray-400" size={48} />
              <div>
                <p className="text-lg font-medium text-gray-700">Upload Receipt Image</p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, or other image formats
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Button */}
      {selectedFile && (
        <div className="text-center mb-6">
          <button
            onClick={handleValidation}
            disabled={isValidating}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {isValidating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <FileText size={20} />
                <span>Validate Receipt</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Validation Result */}
      {validationResult && (
        <div className="mb-6">
          <ValidationStatus result={validationResult} />
        </div>
      )}

      {/* Extracted Data Display */}
      {extractedData && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Extracted Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Transaction ID:</span>
              <p className="font-medium">{extractedData.transactionId}</p>
            </div>
            <div>
              <span className="text-gray-600">Date & Time:</span>
              <p className="font-medium">{extractedData.dateTime}</p>
            </div>
            <div>
              <span className="text-gray-600">From Account:</span>
              <p className="font-medium">{extractedData.fromAccount}</p>
            </div>
            <div>
              <span className="text-gray-600">To Account:</span>
              <p className="font-medium">{extractedData.toAccount}</p>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <p className="font-medium text-green-600">{extractedData.amount?.toLocaleString()} {extractedData.currency}</p>
            </div>
            <div>
              <span className="text-gray-600">Bank:</span>
              <p className="font-medium">{extractedData.bankName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Instructions</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Upload a clear image of your Bank of Khartoum transfer receipt</li>
          <li>• Ensure the receipt shows transfer to account: 0813 0156 8752 0001</li>
          <li>• Receipt should be recent (within 30 days)</li>
          <li>• All transaction details must be clearly visible</li>
        </ul>
      </div>
    </div>
  );
};

export default DonatePage;