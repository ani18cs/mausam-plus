import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../utils/i18n';
import { Phone, User, CheckCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { Button } from '@mausam/design-system';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { userProfile, loginWithPhone } = useAppStore();

  const [step, setStep] = useState<'phone' | 'otp' | 'demographics'>('phone');
  const [phone, setPhone] = useState(userProfile.phone.replace('+91 ', '') || '');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState(userProfile.name || '');
  const [age, setAge] = useState<string>(userProfile.age ? String(userProfile.age) : '25');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_to_say'>(
    userProfile.gender || 'male'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('demographics');
    }, 600);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone}`;
    loginWithPhone(formattedPhone, name || 'Weather Citizen', Number(age) || 25, gender);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-card border border-border-strong p-5 space-y-4 shadow-2xl animate-scaleUp">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-content-primary">
                {step === 'demographics' ? t('profile.demographics') : t('profile.login_btn')}
              </h3>
              <p className="text-[10px] text-content-muted">Mausam+ Secure Citizen Auth</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-content-muted hover:bg-card-subtle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Phone Number */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <p className="text-xs text-content-secondary">
              Enter your mobile number to personalize your weather alerts, save multi-city destinations, and track local hazard reports.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-content-muted">Mobile Number</label>
              <div className="flex rounded-2xl border border-border-subtle bg-input overflow-hidden focus-within:border-accent-primary focus-within:ring-1 focus-within:ring-accent-primary">
                <span className="flex items-center px-3 text-xs font-bold text-content-secondary border-r border-border-subtle bg-card-subtle">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="flex-1 bg-transparent px-3 py-2.5 text-xs text-content-primary focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={phone.length < 10 || isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Sending OTP...' : 'Send Verification OTP'}
            </Button>
          </form>
        )}

        {/* Step 2: 4-digit OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>OTP sent to +91 {phone}. Enter demo code <strong>1234</strong></span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-content-muted">4-Digit Security Code</label>
              <input
                type="text"
                required
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full text-center tracking-widest font-heading font-extrabold text-xl rounded-2xl border border-border-subtle bg-input py-2.5 text-content-primary focus:border-accent-primary focus:outline-none"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" size="md" onClick={() => setStep('phone')}>
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={otp.length < 4 || isSubmitting}
                rightIcon={<CheckCircle className="w-4 h-4" />}
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Demographics (Name, Age, Gender) */}
        {step === 'demographics' && (
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <p className="text-xs text-content-secondary">
              Help Mausam+ calibrate health risk indexes (heat stress, cardiovascular strain) to your demographic profile.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-content-muted">{t('profile.name')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aniket Singh"
                className="w-full rounded-xl border border-border-subtle bg-input px-3 py-2 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-content-muted">{t('profile.age')}</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-input px-3 py-2 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-content-muted">{t('profile.gender')}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full rounded-xl border border-border-subtle bg-input px-2.5 py-2 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
                >
                  <option value="male">{t('profile.gender_male')}</option>
                  <option value="female">{t('profile.gender_female')}</option>
                  <option value="other">{t('profile.gender_other')}</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" fullWidth rightIcon={<CheckCircle className="w-4 h-4" />}>
                Complete Profile Setup
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
