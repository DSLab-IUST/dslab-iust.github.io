import { useTranslation } from 'react-i18next';
import { ButtonLink } from '@/components/ui/Button';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="container-narrow py-32 text-center">
      <p className="kicker">404</p>
      <h1 className="text-h1 mt-4">{t('state.notFoundTitle')}</h1>
      <p className="lede mx-auto mt-4">{t('state.notFoundBody')}</p>

      <ButtonLink to="/" variant="primary" size="lg" className="mt-9">
        {t('state.backHome')}
      </ButtonLink>
    </div>
  );
}
