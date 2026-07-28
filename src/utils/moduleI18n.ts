import { AuditItem, AuditModule, SubDetailItem } from '../types';
import { Language } from '../i18n/translations';

/**
 * Get localized audit module name
 */
export function getLocalizedModuleName(mod: AuditModule, language: Language): string {
  return language === 'en' && mod.nameEn ? mod.nameEn : mod.name;
}

/**
 * Get localized sub-module display name (key)
 */
export function getLocalizedSubModuleName(
  mod: AuditModule,
  subModuleKey: string,
  language: Language
): string {
  if (language === 'en') {
    const sub = mod.subModules[subModuleKey];
    if (sub?.nameEn) return sub.nameEn;
  }
  return subModuleKey;
}

/**
 * Get localized audit item name
 */
export function getLocalizedItemName(item: AuditItem, language: Language): string {
  return language === 'en' && item.nameEn ? item.nameEn : item.name;
}

/**
 * Get localized item details
 */
export function getLocalizedItemDetails(item: AuditItem, language: Language): string[] {
  if (language === 'en' && item.detailsEn) return item.detailsEn;
  return item.details || [];
}

/**
 * Get localized item comment
 */
export function getLocalizedItemComment(item: AuditItem, language: Language): string {
  return language === 'en' && item.commentEn ? item.commentEn : item.comment || '';
}

/**
 * Get localized sub-detail name
 */
export function getLocalizedSubDetailName(
  sub: SubDetailItem,
  language: Language
): string {
  return language === 'en' && sub.nameEn ? sub.nameEn : sub.name;
}

/**
 * Get localized guidance
 */
export function getLocalizedGuidance(item: AuditItem, language: Language): string {
  return language === 'en' && item.guidanceEn ? item.guidanceEn : (item.guidance || '');
}

/**
 * Get localized skippable label
 */
export function getLocalizedSkippableLabel(
  mod: AuditModule,
  language: Language
): string {
  return language === 'en' && mod.skippableLabelEn
    ? mod.skippableLabelEn
    : (mod.skippableLabel || '');
}

/**
 * Get localized sub-module optional label
 */
export function getLocalizedOptionalLabel(
  mod: AuditModule,
  subModuleKey: string,
  language: Language
): string {
  if (language === 'en') {
    const sub = mod.subModules[subModuleKey];
    if (sub?.optionalLabelEn) return sub.optionalLabelEn;
  }
  const sub = mod.subModules[subModuleKey];
  return sub?.optionalLabel || '';
}

/**
 * Localize an array of sub-details
 */
export function localizeSubDetails(
  subs: SubDetailItem[] | undefined,
  language: Language
): SubDetailItem[] {
  if (!subs) return [];
  if (language === 'en') {
    return subs.map(s => ({
      id: s.id,
      name: s.nameEn || s.name,
    }));
  }
  return subs.map(s => ({ id: s.id, name: s.name }));
}
