import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { 
  Package, Edit2, Hash, MessageSquare, 
  BookOpen, PenTool, Backpack, Palette,
  Footprints, BookText, Droplet, // ALTERNATIVE ICONS
  Plus, Minus, AlertCircle, Check
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../i18n/languageUtils';

const Step2_DonationDetails = () => {
  const { register, formState: { errors }, watch, setValue, trigger, clearErrors } = useFormContext();
  const { language } = useLanguage();
  const [selectedItem, setSelectedItem] = useState(watch('itemType') || '');
  const [quantity, setQuantity] = useState(watch('quantity') || 1);
  const [itemDetailsLength, setItemDetailsLength] = useState(watch('itemDetails')?.length || 0);
  const [notesLength, setNotesLength] = useState(watch('notes')?.length || 0);
  const [focusedTextarea, setFocusedTextarea] = useState(null);

  const donationItems = [
    {
      value: 'notebooks',
      label: getTranslation('notebooks', language),
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      description: getTranslation('notebooksDescription', language) || 'Exercise books, notebooks, writing pads',
      ariaLabel: getTranslation('selectNotebooks', language) || 'Select notebooks'
    },
    {
      value: 'pens',
      label: getTranslation('pens', language),
      icon: PenTool,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/30',
      description: getTranslation('pensDescription', language) || 'Pens, pencils, erasers, sharpeners',
      ariaLabel: getTranslation('selectPens', language) || 'Select pens and pencils'
    },
    {
      value: 'backpacks',
      label: getTranslation('backpacks', language),
      icon: Backpack,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      description: getTranslation('backpacksDescription', language) || 'School bags, backpacks, pencil cases',
      ariaLabel: getTranslation('selectBackpacks', language) || 'Select backpacks'
    },
    {
      value: 'crayons',
      label: getTranslation('crayons', language),
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      description: getTranslation('crayonsDescription', language) || 'Crayons, markers, color pencils',
      ariaLabel: getTranslation('selectCrayons', language) || 'Select crayons and markers'
    },
    // NEW ITEMS WITH ALTERNATIVE ICONS
    {
      value: 'shoes',
      label: getTranslation('shoes', language) || 'Shoes',
      icon: Footprints, // Changed from Shoe to Footprints
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      description: getTranslation('shoesDescription', language) || 'School shoes, sports shoes, sandals',
      ariaLabel: getTranslation('selectShoes', language) || 'Select shoes'
    },
    {
      value: 'pastExamBooks',
      label: getTranslation('pastExamBooks', language) || 'Past Exam Books',
      icon: BookText, // Changed from GraduationCap to BookText
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      description: getTranslation('pastExamBooksDescription', language) || 'Past exam papers, revision books, study guides',
      ariaLabel: getTranslation('selectPastExamBooks', language) || 'Select past exam books'
    },
    {
      value: 'waterBottles',
      label: getTranslation('waterBottles', language) || 'School Water Bottles',
      icon: Droplet, // Changed from Droplets to Droplet
      color: 'from-sky-500 to-blue-500',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
      description: getTranslation('waterBottlesDescription', language) || 'Reusable water bottles, flasks, drinkware',
      ariaLabel: getTranslation('selectWaterBottles', language) || 'Select school water bottles'
    },
    {
      value: 'other',
      label: getTranslation('other', language),
      icon: Package,
      color: 'from-slate-500 to-gray-500',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/30',
      description: getTranslation('otherDescription', language) || 'Other stationery items',
      ariaLabel: getTranslation('selectOther', language) || 'Select other items'
    }
  ];

  // ... rest of the code remains the same
  const handleItemSelect = useCallback((value) => {
    setSelectedItem(value);
    setValue('itemType', value, { shouldValidate: true });
    clearErrors('itemType');
    trigger('itemType');
  }, [setValue, clearErrors, trigger]);

  const incrementQuantity = useCallback(() => {
    const newQuantity = Math.min((quantity || 1) + 1, 100);
    setQuantity(newQuantity);
    setValue('quantity', newQuantity, { shouldValidate: true });
    trigger('quantity');
  }, [quantity, setValue, trigger]);

  const decrementQuantity = useCallback(() => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setValue('quantity', newQuantity, { shouldValidate: true });
      trigger('quantity');
    }
  }, [quantity, setValue, trigger]);

  const handleQuantityChange = useCallback((e) => {
    const value = e.target.value;
    const numValue = parseInt(value) || 1;
    const clampedValue = Math.min(Math.max(numValue, 1), 100);
    setQuantity(clampedValue);
    setValue('quantity', clampedValue, { shouldValidate: true });
  }, [setValue]);

  const handleQuantityInput = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value === '' ? '' : parseInt(value));
    }
  }, []);

  const handleItemDetailsChange = useCallback((e) => {
    const value = e.target.value;
    setItemDetailsLength(value.length);
    setValue('itemDetails', value, { shouldValidate: true });
  }, [setValue]);

  const handleNotesChange = useCallback((e) => {
    const value = e.target.value;
    setNotesLength(value.length);
    setValue('notes', value, { shouldValidate: true });
  }, [setValue]);

  // Auto-select "other" if item details are entered without selecting an item
  useEffect(() => {
    const itemDetails = watch('itemDetails');
    if (itemDetails && itemDetails.trim().length > 0 && !selectedItem) {
      handleItemSelect('other');
    }
  }, [watch('itemDetails'), selectedItem, handleItemSelect]);

  // Initialize quantity from form
  useEffect(() => {
    const initialQuantity = watch('quantity');
    if (initialQuantity) {
      setQuantity(initialQuantity);
    }
  }, [watch('quantity')]);

  // Watch item details and notes length
  useEffect(() => {
    const subscription = watch((value) => {
      setItemDetailsLength(value.itemDetails?.length || 0);
      setNotesLength(value.notes?.length || 0);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
      role="form"
      aria-label="Donation details form"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 mb-4 backdrop-blur-lg"
          aria-hidden="true"
        >
          <Package className="w-7 h-7 text-emerald-600" />
        </motion.div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {getTranslation('step2', language)}
        </h3>
        <p className="text-gray-700 max-w-lg mx-auto">
          {getTranslation('step2_description', language) || 'Select what you\'d like to donate. Every item helps a student learn.'}
        </p>
      </div>

      {/* Item Selection */}
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-4" id="item-type-label">
            {getTranslation('whatToDonate', language) || 'What would you like to donate?'}
            <span className="text-red-600 ml-1" aria-hidden="true">*</span>
            <span className="sr-only">required</span>
          </label>
          
          {/* Visual selection cards - Updated to grid-cols-2 lg:grid-cols-4 for 8 items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {donationItems.map((item, index) => (
              <motion.button
                key={item.value}
                type="button"
                onClick={() => handleItemSelect(item.value)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300
                  text-left focus:outline-none focus:ring-2 focus:ring-mesh-sky focus:ring-offset-2 focus:ring-offset-white
                  backdrop-blur-lg
                  ${selectedItem === item.value
                    ? `${item.borderColor} ${item.bgColor} scale-[1.02] shadow-lg shadow-blue-500/20`
                    : 'border-white/30 bg-gradient-to-br from-white/20 to-white/10 hover:bg-gradient-to-br hover:from-white/30 hover:to-white/20 hover:border-white/50'
                  }
                  group
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={item.ariaLabel}
                aria-pressed={selectedItem === item.value}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemSelect(item.value);
                  }
                }}
              >
                {/* Selection Indicator */}
                {selectedItem === item.value && (
                  <motion.div
                    layoutId="selectionRing"
                    className="absolute inset-0 rounded-xl border-2 border-mesh-sky/30 backdrop-blur-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    aria-hidden="true"
                  />
                )}
                
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 backdrop-blur-lg`}>
                  <item.icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                
                {/* Label */}
                <h4 className="font-semibold text-gray-900 mb-2">{item.label}</h4>
                
                {/* Description */}
                <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
                
                {/* Selection Check */}
                <div className={`
                  absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md
                  ${selectedItem === item.value 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                    : 'bg-white/20 text-gray-500 border border-white/30'
                  }
                  transition-all duration-300
                `} aria-hidden="true">
                  {selectedItem === item.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence>
            {errors.itemType && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 text-sm text-red-600 flex items-center gap-2 backdrop-blur-lg bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                role="alert"
                id="itemType-error"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {errors.itemType.message || getTranslation('selectItemType', language) || 'Please select an item type'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label htmlFor="itemDetails" className="block text-sm font-medium text-gray-800">
              {getTranslation('itemDetails', language) || 'Item Details'}
              <span className="text-gray-600 ml-1">({getTranslation('optional', language) || 'Optional'})</span>
            </label>
            <div className="relative">
              <Edit2 className="absolute left-3 top-3 w-5 h-5 text-gray-600 z-10" aria-hidden="true" />
              <textarea
                id="itemDetails"
                {...register('itemDetails', {
                  maxLength: {
                    value: 200,
                    message: getTranslation('maxLength200', language) || 'Maximum 200 characters'
                  }
                })}
                onChange={handleItemDetailsChange}
                onFocus={() => setFocusedTextarea('itemDetails')}
                onBlur={() => setFocusedTextarea(null)}
                placeholder={getTranslation('itemDetailsPlaceholder', language) || "e.g., A4 size notebooks, 80 pages, brand new"}
                rows="3"
                maxLength="200"
                className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-lg bg-gradient-to-br from-white/20 to-white/10 border border-white/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-mesh-sky focus:shadow-[0_0_20px_rgba(79,172,254,0.3)] transition-all duration-300 resize-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                aria-describedby="itemDetailsHelp itemDetailsCounter"
              />
              
              {/* Glass Blur Overlay */}
              <div className={`
                absolute inset-0 rounded-xl pointer-events-none
                backdrop-blur-xl
                transition-opacity duration-300
                ${focusedTextarea === 'itemDetails' ? 'opacity-100' : 'opacity-0'}
              `} />
            </div>
            <div className="flex justify-between items-center">
              <p id="itemDetailsHelp" className="text-xs text-gray-600">
                {getTranslation('itemDetailsHelp', language) || 'Specific details help us distribute appropriately'}
              </p>
              <span id="itemDetailsCounter" className={`text-xs font-medium ${
                itemDetailsLength >= 200 ? 'text-red-600' : 
                itemDetailsLength > 180 ? 'text-amber-600' : 'text-gray-500'
              }`}>
                {itemDetailsLength} / 200
              </span>
            </div>
          </motion.div>

          {/* Quantity Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-800">
              {getTranslation('quantity', language) || 'Quantity'}
              <span className="text-red-600 ml-1" aria-hidden="true">*</span>
              <span className="sr-only">required</span>
            </label>
            
            <div className="relative">
              <div className="flex items-center backdrop-blur-lg bg-gradient-to-br from-white/20 to-white/10 rounded-xl border border-white/40 overflow-hidden">
                {/* Decrease Button */}
                <button
                  type="button"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-mesh-sky focus:relative focus:z-10 transition-all duration-300"
                  aria-label={getTranslation('decreaseQuantity', language) || 'Decrease quantity'}
                >
                  <Minus className="w-5 h-5 text-gray-700" aria-hidden="true" />
                </button>
                
                {/* Input */}
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" aria-hidden="true" />
                  <input
                    id="quantity"
                    {...register('quantity', {
                      required: getTranslation('quantityRequired', language) || 'Quantity is required',
                      min: { value: 1, message: getTranslation('min1Item', language) || 'Minimum 1 item' },
                      max: { value: 100, message: getTranslation('max100Items', language) || 'Maximum 100 items' },
                      valueAsNumber: true
                    })}
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={handleQuantityInput}
                    onBlur={handleQuantityChange}
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-mesh-sky/20 focus:z-10 relative"
                    aria-describedby="quantityHelp"
                    aria-invalid={errors.quantity ? 'true' : 'false'}
                  />
                </div>
                
                {/* Increase Button */}
                <button
                  type="button"
                  onClick={incrementQuantity}
                  disabled={quantity >= 100}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-mesh-sky focus:relative focus:z-10 transition-all duration-300"
                  aria-label={getTranslation('increaseQuantity', language) || 'Increase quantity'}
                >
                  <Plus className="w-5 h-5 text-gray-700" aria-hidden="true" />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <p id="quantityHelp" className="text-xs text-gray-600">
                  {getTranslation('max100ItemsPerDonation', language) || 'Max 100 items per donation'}
                </p>
                <AnimatePresence>
                  {errors.quantity && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-600 backdrop-blur-lg bg-red-500/10 px-2 py-1 rounded-lg"
                      role="alert"
                      id="quantity-error"
                    >
                      {errors.quantity.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <label htmlFor="notes" className="block text-sm font-medium text-gray-800">
            {getTranslation('additionalNotes', language) || 'Additional Notes'}
            <span className="text-gray-600 ml-1">({getTranslation('optional', language) || 'Optional'})</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-600 z-10" aria-hidden="true" />
            <textarea
              id="notes"
              {...register('notes', {
                maxLength: {
                  value: 500,
                  message: getTranslation('maxLength500', language) || 'Maximum 500 characters'
                }
              })}
              onChange={handleNotesChange}
              onFocus={() => setFocusedTextarea('notes')}
              onBlur={() => setFocusedTextarea(null)}
              placeholder={getTranslation('notesPlaceholder', language) || "Any special instructions, accessibility needs, or specific requests"}
              rows="4"
              maxLength="500"
              className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-lg bg-gradient-to-br from-white/20 to-white/10 border border-white/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-mesh-sky focus:shadow-[0_0_20px_rgba(79,172,254,0.3)] transition-all duration-300 resize-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
              aria-describedby="notesHelp notesCounter"
            />
            
            {/* Glass Blur Overlay */}
            <div className={`
              absolute inset-0 rounded-xl pointer-events-none
              backdrop-blur-xl
              transition-opacity duration-300
              ${focusedTextarea === 'notes' ? 'opacity-100' : 'opacity-0'}
            `} />
          </div>
          <div className="flex justify-between items-center">
            <p id="notesHelp" className="text-xs text-gray-600">
              {getTranslation('notesHelp', language) || 'Helpful for pickup coordination'}
            </p>
            <span id="notesCounter" className={`text-xs font-medium ${
              notesLength >= 500 ? 'text-red-600' : 
              notesLength > 450 ? 'text-amber-600' : 'text-gray-500'
            }`}>
              {notesLength} / 500
            </span>
          </div>
        </motion.div>
      </div>

      {/* Selection Preview */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 overflow-hidden"
          >
            <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-mesh-sky/20 to-mesh-teal/20 border border-white/40 shadow-[0_8px_32px_0_rgba(79,172,254,0.15)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-mesh-sky to-mesh-teal flex items-center justify-center backdrop-blur-lg" aria-hidden="true">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {getTranslation('readyToDonate', language) || 'Ready to Donate'}
                    </h4>
                    <p className="text-gray-700">
                      {donationItems.find(item => item.value === selectedItem)?.label || selectedItem} • 
                      {getTranslation('quantity', language) || 'Quantity'}: {quantity || 1}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleItemSelect('')}
                  className="px-4 py-2 rounded-lg backdrop-blur-lg bg-white/20 text-gray-800 text-sm hover:bg-white/30 border border-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-mesh-sky"
                  aria-label={getTranslation('changeSelection', language) || 'Change selection'}
                >
                  {getTranslation('changeSelection', language) || 'Change Selection'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Step2_DonationDetails;