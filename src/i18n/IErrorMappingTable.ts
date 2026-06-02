// 💡 헬퍼가 받아들일 매핑 테이블 규격 정의
export interface IErrorMappingTable {
	// "필드명.에러종류" 또는 "필드명"을 키로 받음
	[pathAndType: string]: string;
}
