'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, Phone, Book, Search, Send, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const faqs = [
    {
      question: 'How do I create a birthday website?',
      answer: 'Simply click "Create Birthday Website" on the homepage, follow the onboarding steps, add your photos and message, choose a template, and publish!'
    },
    {
      question: 'Is it free to create a birthday website?',
      answer: 'Yes! Creating and publishing a birthday website is completely free. Premium plans offer additional features like more photos, music, and AI message generation.'
    },
    {
      question: 'How long does my birthday website stay active?',
      answer: 'Free websites stay active for 30 days. Premium plans offer 1 year or lifetime access depending on your chosen plan.'
    },
    {
      question: 'Can I edit my birthday website after publishing?',
      answer: 'Yes! You can edit your website anytime from your dashboard. Changes are applied instantly.'
    },
    {
      question: 'How do I share my birthday website?',
      answer: 'After publishing, you\'ll get a unique link that you can share on WhatsApp, Instagram, or any platform. We also provide QR codes for easy sharing.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, UPI, and net banking through Razorpay, a secure payment gateway.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-white">Help & Support</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Find answers to common questions or reach out to our support team
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/templates" className="p-6 rounded-2xl glass-luxury hover:border-rose-500/30 transition-all text-center space-y-3">
          <Book className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="font-bold text-white">Documentation</h3>
          <p className="text-sm text-slate-400">Learn how to use CelebrationCraft</p>
        </Link>
        
        <a href="mailto:support@celebrationcraft.com" className="p-6 rounded-2xl glass-luxury hover:border-purple-500/30 transition-all text-center space-y-3">
          <Mail className="w-8 h-8 text-purple-400 mx-auto" />
          <h3 className="font-bold text-white">Email Support</h3>
          <p className="text-sm text-slate-400">support@celebrationcraft.com</p>
        </a>
        
        <a href="tel:+919876543210" className="p-6 rounded-2xl glass-luxury hover:border-amber-500/30 transition-all text-center space-y-3">
          <Phone className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="font-bold text-white">Phone Support</h3>
          <p className="text-sm text-slate-400">+91 98765 43210</p>
        </a>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 rounded-2xl glass-luxury space-y-3">
              <h3 className="font-semibold text-white">{faq.question}</h3>
              <p className="text-sm text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto">
        <div className="p-8 rounded-3xl glass-luxury space-y-6">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">Still need help?</h2>
            <p className="text-slate-400 text-sm">Send us a message and we'll get back to you within 24 hours</p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-3 animate-fade-in">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Sent!</h3>
              <p className="text-slate-400">We'll get back to you soon</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:from-rose-600 hover:to-purple-700 transition-all"
              >
                <Send className="w-5 h-5" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
