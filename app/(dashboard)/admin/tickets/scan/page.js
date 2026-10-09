'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { formatApiError } from '@/services/api';
import { checkInTicket } from '@/services/ticketsApi';

/**
 * Gate check-in scanner — reads a ticket's QR code via the device camera
 * (phone browser, per the client's requirement — no hardware scanner) and
 * marks it checked in. A second scan of the same ticket is not an error:
 * it reports "already checked in" with the original timestamp.
 */
export default function AdminTicketScanPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const checkingRef = useRef(false);

  const [cameraError, setCameraError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!authLoading && user && user.role !== 'admin') {
      router.replace(user.role === 'fan' ? '/fan' : '/user');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user || user.role !== 'admin') return undefined;

    let cancelled = false;

    async function handleDecode(token) {
      if (checkingRef.current) return;
      checkingRef.current = true;
      scannerRef.current?.pause();

      try {
        const data = await checkInTicket(token);
        setResult({
          kind: data.already_checked_in ? 'duplicate' : 'success',
          buyerName: data.buyer_name,
          productName: data.product_name,
          checkedInAt: data.checked_in_at,
        });
      } catch (err) {
        setResult({ kind: 'error', message: formatApiError(err, 'Invalid QR code.') });
      } finally {
        checkingRef.current = false;
      }
    }

    import('qr-scanner').then(({ default: QrScanner }) => {
      if (cancelled || !videoRef.current) return;
      const scanner = new QrScanner(
        videoRef.current,
        (res) => handleDecode(res.data),
        { highlightScanRegion: true, highlightCodeOutline: true, maxScansPerSecond: 5 }
      );
      scannerRef.current = scanner;
      scanner.start().catch((err) => setCameraError(err?.message || 'Could not access the camera.'));
    });

    return () => {
      cancelled = true;
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;
    };
  }, [authLoading, user]);

  function handleScanNext() {
    setResult(null);
    scannerRef.current?.start();
  }

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>Gate Check-In</h2>
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: '70vh' }}>
        <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />

        {cameraError && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', textAlign: 'center',
          }}>
            <p style={{ color: '#ff6b6b' }}>{cameraError}</p>
          </div>
        )}

        {result && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '2rem', textAlign: 'center', gap: '1rem',
            background: result.kind === 'success'
              ? 'rgba(0,200,100,0.92)'
              : result.kind === 'duplicate'
                ? 'rgba(255,170,0,0.92)'
                : 'rgba(255,60,60,0.92)',
          }}>
            <i
              className={`fa-solid ${
                result.kind === 'success'
                  ? 'fa-circle-check'
                  : result.kind === 'duplicate'
                    ? 'fa-triangle-exclamation'
                    : 'fa-circle-xmark'
              }`}
              style={{ fontSize: '3rem', color: '#fff' }}
            />
            {result.kind === 'error' ? (
              <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{result.message}</p>
            ) : (
              <>
                <p style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  {result.kind === 'success' ? 'CHECKED IN' : 'ALREADY CHECKED IN'}
                </p>
                <p style={{ color: '#fff', fontSize: '1rem', margin: 0 }}>
                  {result.buyerName || 'Guest'} — {result.productName}
                </p>
                {result.kind === 'duplicate' && result.checkedInAt && (
                  <p style={{ color: '#fff', fontSize: '0.9rem', margin: 0 }}>
                    First scanned at {new Date(result.checkedInAt).toLocaleTimeString()}
                  </p>
                )}
              </>
            )}
            <button type="button" className="cta" onClick={handleScanNext}>Scan Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
