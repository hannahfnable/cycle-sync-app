import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Clock, ShoppingBag, MapPin, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { phases } from '../cycle/PhaseIndicator';
import { typeColors, typeEmojis } from 'ActivityCard';

export default function ActivityDetail({ activity, isOpen, onClose, onAddToSchedule }) {
  if (!activity) return null;

  const typeColor = typeColors[activity.type] || typeColors.wellbeing;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${typeColor} flex items-center justify-center text-4xl shadow-lg`}>
                  {activity.emoji || typeEmojis[activity.type]}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">{activity.name}</h2>
                  <div className="flex items-center gap-2 text-slate-500">
                    {activity.duration_minutes && (
                      <span className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4" />
                        {activity.duration_minutes} min
                      </span>
                    )}
                    <span className="text-sm px-2 py-0.5 bg-slate-100 rounded-full capitalize">
                      {activity.type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phases */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Best for phases</h3>
                <div className="flex flex-wrap gap-2">
                  {activity.phases?.map((phase) => (
                    <span
                      key={phase}
                      className={`px-4 py-2 rounded-2xl text-sm font-medium ${phases[phase]?.bg} ${phases[phase]?.text}`}
                    >
                      {phases[phase]?.emoji} {phase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              {activity.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">About</h3>
                  <p className="text-slate-700 leading-relaxed">{activity.description}</p>
                </div>
              )}

              {/* Benefits */}
              {activity.benefits?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Benefits</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {activity.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affiliate Links */}
              {activity.affiliate_links?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Related Links</h3>
                  <div className="space-y-2">
                    {activity.affiliate_links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                          {link.url?.includes('shop') || link.url?.includes('buy') ? (
                            <ShoppingBag className="w-5 h-5 text-slate-500" />
                          ) : link.url?.includes('class') || link.url?.includes('studio') ? (
                            <MapPin className="w-5 h-5 text-slate-500" />
                          ) : (
                            <ExternalLink className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{link.title}</p>
                          {link.description && (
                            <p className="text-sm text-slate-500">{link.description}</p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Article link */}
              {activity.article_url && (
                <a
                  href={activity.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl mb-6 hover:bg-blue-100 transition-colors"
                >
                  <span className="text-blue-700 font-medium">Read full article</span>
                  <ExternalLink className="w-5 h-5 text-blue-500" />
                </a>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => onAddToSchedule?.(activity)}
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium"
                >
                  Add to Schedule
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}