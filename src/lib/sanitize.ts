/**
 * Sanitize HTML to prevent XSS attacks.
 * Uses a simple regex-based approach that works in all environments.
 * Only allows safe HTML tags and attributes.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  // List of allowed tags
  const allowedTags = ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6"];

  // Remove script tags and their content
  let clean = dirty.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove style tags and their content
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove dangerous event handlers
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, "");

  // Remove javascript: URLs
  clean = clean.replace(/javascript:/gi, "");

  // Remove iframe, object, embed, form tags
  clean = clean.replace(/<(iframe|object|embed|form)\b[^>]*>.*?<\/\1>/gi, "");
  clean = clean.replace(/<(iframe|object|embed|form)\b[^>]*\/?>/gi, "");

  // Only keep allowed attributes on tags (href, class, target, rel)
  clean = clean.replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
    if (!allowedTags.includes(tag.toLowerCase())) {
      // Remove disallowed tags but keep content
      return "";
    }
    // Filter attributes - only keep href, class, target, rel
    const allowedAttrs = attrs.replace(/\s+(\w+)=["'][^"']*["']/g, (attrMatch: string, attrName: string) => {
      if (["href", "class", "target", "rel"].includes(attrName.toLowerCase())) {
        return attrMatch;
      }
      return "";
    });
    return `<${tag}${allowedAttrs}>`;
  });

  return clean;
}

/**
 * Sanitize HTML and return as props for dangerouslySetInnerHTML
 */
export function createSafeHtml(dirty: string): { __html: string } {
  return { __html: sanitizeHtml(dirty) };
}
