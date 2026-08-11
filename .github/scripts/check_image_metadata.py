"""公開画像に位置情報などを含むメタデータが残っていないか検査する。"""

from pathlib import Path


def jpeg_private_segments(path: Path) -> list[str]:
    data = path.read_bytes()
    if not data.startswith(b"\xff\xd8"):
        return ["JPEGとして読み取れません"]

    findings: list[str] = []
    position = 2
    while position < len(data):
        if data[position] != 0xFF:
            break

        while position < len(data) and data[position] == 0xFF:
            position += 1
        if position >= len(data):
            break

        marker = data[position]
        position += 1
        if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
            continue
        if position + 2 > len(data):
            return findings + ["JPEGセグメントが途中で切れています"]

        segment_length = int.from_bytes(data[position : position + 2], "big")
        segment_end = position + segment_length
        if segment_length < 2 or segment_end > len(data):
            return findings + ["JPEGセグメント長が不正です"]

        payload = data[position + 2 : segment_end]
        if marker == 0xE1:
            findings.append("EXIFまたはXMP (APP1)")
        if marker == 0xE2 and payload.startswith(b"MPF\x00"):
            findings.append("MPO付加画像 (APP2/MPF)")

        position = segment_end
        if marker == 0xDA:
            break

    return findings


def main() -> int:
    failures: list[str] = []
    for path in sorted(Path("images").glob("*")):
        if path.suffix.lower() not in {".jpg", ".jpeg"}:
            continue
        findings = jpeg_private_segments(path)
        if findings:
            failures.append(f"{path}: {', '.join(findings)}")

    if failures:
        print("公開画像から削除すべきメタデータが見つかりました:")
        print("\n".join(f"- {failure}" for failure in failures))
        return 1

    print("OK: JPEG画像にEXIF/XMP/MPOメタデータはありません。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
