import { useCallback, useRef, useState } from 'react';

import { FileText, Loader2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { uploadTemplateMedia } from '@/features/templates/api/uploadTemplateMedia';

import { getApiErrorMessage } from '@/lib/api-error';



const IMAGE_ACCEPT = 'image/jpeg,image/png';

const VIDEO_ACCEPT = 'video/mp4';

const DOCUMENT_ACCEPT = 'application/pdf';



type HeaderMediaFormat = 'IMAGE' | 'VIDEO' | 'DOCUMENT';



type HeaderMediaUploadProps = {

  whatsAppAccountId: string;

  headerType: 'image' | 'video' | 'document';

  fileName?: string;

  previewUrl?: string;

  onUploaded: (result: {

    handle: string;

    format: HeaderMediaFormat;

    fileName: string;

    previewUrl?: string;

  }) => void;

  onClear: () => void;

  disabled?: boolean;

};



export function HeaderMediaUpload({

  whatsAppAccountId,

  headerType,

  fileName,

  previewUrl,

  onUploaded,

  onClear,

  disabled,

}: HeaderMediaUploadProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);



  const accept =

    headerType === 'image'

      ? IMAGE_ACCEPT

      : headerType === 'video'

        ? VIDEO_ACCEPT

        : DOCUMENT_ACCEPT;



  const maxLabel =

    headerType === 'image' ? '5 MB' : headerType === 'video' ? '16 MB' : '100 MB';



  const typeLabel =

    headerType === 'image' ? 'JPEG or PNG' : headerType === 'video' ? 'MP4' : 'PDF';



  const handleFileChange = useCallback(

    async (event: React.ChangeEvent<HTMLInputElement>) => {

      const file = event.target.files?.[0];

      event.target.value = '';

      if (!file) return;



      setUploading(true);

      setError(null);



      const localPreview = headerType === 'document' ? undefined : URL.createObjectURL(file);



      try {

        const result = await uploadTemplateMedia(whatsAppAccountId, file);

        const expectedFormat: HeaderMediaFormat =

          headerType === 'image' ? 'IMAGE' : headerType === 'video' ? 'VIDEO' : 'DOCUMENT';



        if (result.format !== expectedFormat) {

          throw new Error(`Expected ${typeLabel} for this header type`);

        }



        onUploaded({

          handle: result.handle,

          format: result.format,

          fileName: result.fileName,

          previewUrl: localPreview,

        });

      } catch (err) {

        if (localPreview) URL.revokeObjectURL(localPreview);

        setError(getApiErrorMessage(err));

      } finally {

        setUploading(false);

      }

    },

    [headerType, onUploaded, typeLabel, whatsAppAccountId],

  );



  return (

    <div className="space-y-3">

      <div className="flex flex-wrap items-center gap-2">

        <Input

          ref={inputRef}

          type="file"

          accept={accept}

          className="hidden"

          onChange={handleFileChange}

          disabled={disabled || uploading}

        />

        <Button

          type="button"

          variant="outline"

          size="sm"

          disabled={disabled || uploading}

          onClick={() => inputRef.current?.click()}

        >

          {uploading ? (

            <Loader2 className="mr-2 h-4 w-4 animate-spin" />

          ) : (

            <Upload className="mr-2 h-4 w-4" />

          )}

          {fileName ? 'Replace file' : 'Upload file'}

        </Button>

        {fileName ? (

          <Button type="button" variant="ghost" size="sm" onClick={onClear} disabled={uploading}>

            Remove

          </Button>

        ) : null}

      </div>

      <p className="text-xs text-muted-foreground">

        {typeLabel} — max {maxLabel}. Uploaded to Meta via resumable upload; handle is used in

        template submission.

      </p>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {previewUrl && headerType === 'image' ? (

        <img

          src={previewUrl}

          alt="Header preview"

          className="max-h-40 rounded-md border object-contain"

        />

      ) : null}

      {previewUrl && headerType === 'video' ? (

        <video src={previewUrl} controls className="max-h-40 w-full rounded-md border" />

      ) : null}

      {fileName && headerType === 'document' ? (

        <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">

          <FileText className="h-4 w-4 shrink-0" />

          <span className="truncate">{fileName}</span>

        </div>

      ) : null}

      {fileName && headerType !== 'document' ? (

        <p className="text-xs text-muted-foreground">Uploaded: {fileName}</p>

      ) : null}

    </div>

  );

}

