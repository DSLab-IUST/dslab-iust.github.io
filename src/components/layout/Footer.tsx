import { useTranslation } from 'react-i18next';
import { GitHubIcon, MailIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site';
import { useLocale } from '@/providers/LocaleProvider';
import { NAV_ITEMS } from './navigation';
import { SectionLink } from './SectionNav';

export function Footer() {
  const { t } = useTranslation();
  const { locale } = useLocale();

  return (
    <footer className="border-border mt-[var(--space-section-sm)] border-t">
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="brand-mark" aria-hidden="true">
              DS
            </span>
            <span className="flex flex-col">
              <strong className="text-h5">{t('brand.name')}</strong>
              <small className="text-text-muted text-caption">{t('brand.university')}</small>
            </span>
          </div>
          <p className="text-text-muted text-body-sm mt-5 max-w-[46ch]">{t('brand.tagline')}</p>
        </div>

        <nav aria-label={t('footer.explore')} className="flex flex-col gap-3">
          <h2 className="text-h6 text-text-secondary">{t('footer.explore')}</h2>
          {NAV_ITEMS.map((item) => (
            <SectionLink
              key={item.hash}
              hash={item.hash}
              markCurrent={false}
              className="text-text-muted text-body-sm hover:text-accent transition-colors duration-(--duration-fast)"
            >
              {t(item.labelKey)}
            </SectionLink>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-h6 text-text-secondary">{t('footer.contact')}</h2>

          <a
            className="text-text-muted text-body-sm hover:text-accent inline-flex items-center gap-2 transition-colors duration-(--duration-fast)"
            href={`mailto:${siteConfig.links.email}`}
          >
            <MailIcon />
            {siteConfig.links.email}
          </a>

          <a
            className="text-text-muted text-body-sm hover:text-accent inline-flex items-center gap-2 transition-colors duration-(--duration-fast)"
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer noopener"
          >
            <GitHubIcon />
            {siteConfig.repository.owner}
          </a>

          <p className="text-text-muted text-caption mt-2 max-w-[36ch]">
            {siteConfig.links.address[locale]}
          </p>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="container text-text-faint text-caption flex flex-wrap items-center justify-between gap-3 py-5">
          <span>
            © {new Date().getFullYear()} — {t('footer.rights')}
          </span>
          <span>{t('footer.builtWith')}</span>
        </div>
      </div>
    </footer>
  );
}
